// ============================================================
// EventFlow — camada de autenticação e perfil (compartilhada por todas as páginas)
// Depende de: ef-config.js carregado antes, e do script do supabase-js (CDN).
//
// Níveis:
//   owner     = dono da plataforma (sem empresa). Cadastra empresas e a
//               primeira conta de cada uma; usa a tela plataforma.html.
//   gerencia  = vê tudo da própria empresa, não cadastra gente nova.
//   producao  = estoque + áreas do projeto; sem vendas/financeiro/equipe.
//   estoque   = só o estoque; sem áreas/vendas/financeiro/equipe.
// ============================================================
(function (g) {
  'use strict';

  const cfg = g.EF_CONFIG || {};
  const ready = !!(g.supabase && cfg.url && cfg.anonKey && !cfg.url.startsWith('COLE_AQUI'));
  const client = ready ? g.supabase.createClient(cfg.url, cfg.anonKey) : null;

  const EF = {
    client,
    user: null,
    profile: null,
    ready,
  };

  // Chame no topo de toda página protegida.
  // opts.public       = true -> não redireciona se não estiver logado (ex: login.html)
  // opts.ownerOnly    = true -> só o dono da plataforma (plataforma.html)
  // opts.gerenciaOnly = true -> só quem é gerência na própria empresa
  EF.init = async function (opts) {
    opts = opts || {};

    if (!ready) {
      console.error('EventFlow: configure ef-config.js com a URL e a anon key do seu projeto Supabase.');
      showConfigWarning();
      return false;
    }

    const { data, error } = await client.auth.getUser();
    if (error || !data.user) {
      if (!opts.public) location.href = 'login.html';
      return false;
    }
    EF.user = data.user;

    const { data: profile } = await client
      .from('profiles')
      .select('*')
      .eq('id', EF.user.id)
      .maybeSingle();

    EF.profile = profile || null;

    if (!EF.profile || EF.profile.ativo === false) {
      await client.auth.signOut();
      location.href = 'login.html?bloqueado=1';
      return false;
    }

    // O owner não pertence a nenhuma empresa — nas páginas normais do
    // sistema (dashboard, estoque, usuários...) ele é mandado pra tela dele.
    if (EF.isOwner() && !opts.ownerOnly && !opts.public) {
      location.href = 'plataforma.html';
      return false;
    }
    if (opts.ownerOnly && !EF.isOwner()) {
      location.href = 'dashboard.html';
      return false;
    }
    if (opts.gerenciaOnly && !EF.isGerencia()) {
      location.href = 'dashboard.html';
      return false;
    }
    if (opts.areasOnly && !EF.canSeeAreas()) {
      location.href = 'dashboard.html';
      return false;
    }
    if (opts.stockOnly && !(EF.isGerencia() || EF.isProducao() || EF.isEstoque())) {
      location.href = 'dashboard.html';
      return false;
    }

    document.documentElement.dataset.role = EF.profile.role || '';
    if (g.EF_UI && EF_UI.syncUser) EF_UI.syncUser();
    if (g.EF_UI && EF_UI.applyPermissions) EF_UI.applyPermissions();
    if (EF.canSeeFinance()) document.documentElement.dataset.financeiro = 'true';
    if (EF.canSeeAreas()) document.documentElement.dataset.areas = 'true';
    if (EF.canSeeUsuarios()) document.documentElement.dataset.usuarios = 'true';
    return true;
  };

  EF.isOwner = () => !!(EF.profile && EF.profile.role === 'owner');
  EF.isGerencia = () => !!(EF.profile && EF.profile.role === 'gerencia');
  EF.isProducao = () => !!(EF.profile && EF.profile.role === 'producao');
  EF.isEstoque = () => !!(EF.profile && EF.profile.role === 'estoque');

  EF.canSeeFinance = () => EF.isGerencia();                                   // vendas + financeiro
  EF.canSeeAreas = () => EF.isGerencia() || EF.isProducao();                  // áreas do projeto (calculadoras)
  EF.canSeeUsuarios = () => EF.isGerencia();                                  // tela "Usuários e permissões"

  // Evento selecionado fica lembrado entre páginas (localStorage do navegador)
  // até o usuário trocar de evento de propósito — evita ter que reselecionar
  // toda hora ao navegar entre as áreas do sistema.
  EF.getEventoSelecionado = function () {
    try { return localStorage.getItem('ef_evento_selecionado') || ''; } catch (e) { return ''; }
  };
  EF.setEventoSelecionado = function (id) {
    try {
      if (id) localStorage.setItem('ef_evento_selecionado', id);
      else localStorage.removeItem('ef_evento_selecionado');
    } catch (e) { /* localStorage indisponível (ex: aba anônima) — segue sem lembrar */ }
  };


  // Reserva/devolve estoque. Usa RPC atômica quando o schema atualizado estiver
  // instalado; mantém fallback compatível com bancos antigos.
  EF.adjustStock = async function (itemId, delta) {
    if (!client || !itemId || !delta) return { ok: true };
    try {
      var rpc = await client.rpc('ajustar_estoque', { p_item_id: itemId, p_delta: delta });
      if (!rpc.error) return { ok: true, quantidade: rpc.data };
      // 42883 = função ainda não instalada. Só nesse caso usa compatibilidade.
      if (String(rpc.error.code || '') !== '42883' && !/ajustar_estoque/i.test(rpc.error.message || '')) {
        return { error: rpc.error.message || 'Não foi possível atualizar o estoque.' };
      }
    } catch (e) { /* segue para fallback */ }

    var q = await client.from('estoque_itens').select('id,quantidade_disponivel').eq('id', itemId).maybeSingle();
    if (q.error || !q.data) return { error: (q.error && q.error.message) || 'Item não encontrado no estoque.' };
    var atual = Number(q.data.quantidade_disponivel || 0);
    var nova = atual + Number(delta);
    if (nova < 0) return { error: 'Estoque insuficiente. Disponível: ' + atual + '.' };
    var up = await client.from('estoque_itens').update({ quantidade_disponivel: nova }).eq('id', itemId);
    return up.error ? { error: up.error.message } : { ok: true, quantidade: nova };
  };

  EF.logout = async function () {
    if (client) await client.auth.signOut();
    location.href = 'login.html';
  };

  // Cria uma empresa nova (só o owner tem permissão, via RLS).
  EF.criarEmpresa = async function (nome) {
    if (!ready) return { error: 'EventFlow não está configurado.' };
    var { data, error } = await client.from('empresas').insert({ nome: nome }).select().maybeSingle();
    if (error) return { error: error.message };
    return { ok: true, empresa: data };
  };

  EF.listarEmpresas = async function () {
    return await client.from('empresas').select('*').order('created_at', { ascending: true });
  };

  // Chama a Edge Function "create-user" (só funciona se EF.isOwner()).
  // Cria a conta já com a senha escolhida, numa empresa e nível específicos
  // — sem mandar e-mail nenhum.
  // Retorna { ok: true } ou { error: 'mensagem' }.
  EF.createUser = async function (nome, email, senha, role, empresaId) {
    if (!ready) return { error: 'EventFlow não está configurado.' };
    const { data: sessionData } = await client.auth.getSession();
    const token = sessionData && sessionData.session ? sessionData.session.access_token : null;
    if (!token) return { error: 'Sessão expirada, entre de novo.' };

    try {
      const res = await fetch(cfg.url + '/functions/v1/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          apikey: cfg.anonKey,
        },
        body: JSON.stringify({ nome, email, senha, role, empresa_id: empresaId }),
      });
      const out = await res.json();
      if (!res.ok) return { error: out.error || 'Erro ao criar usuário.' };
      return out;
    } catch (e) {
      return { error: 'Não foi possível falar com o servidor (' + e + ').' };
    }
  };

  function showConfigWarning() {
    const box = document.createElement('div');
    box.style.cssText =
      'position:fixed;inset:0;z-index:9999;background:#0a0a0b;color:#f3f1ec;' +
      'display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;padding:24px;';
    box.innerHTML =
      '<div style="max-width:480px;text-align:center;">' +
      '<div style="font-family:\'Space Grotesk\',sans-serif;font-size:18px;font-weight:600;margin-bottom:12px;">EventFlow ainda não está configurado</div>' +
      '<div style="color:#8c8c91;font-size:13.5px;line-height:1.6;">Abra o arquivo <code style="color:#7fa8c9;">ef-config.js</code> e cole a URL e a anon key do seu projeto Supabase (Project Settings → API). Depois recarregue a página.</div>' +
      '</div>';
    document.body.appendChild(box);
  }

  // Mostra o aviso automaticamente se ef-config.js ainda não foi preenchido,
  // sem precisar esperar cada página chamar EF.init().
  if (!ready) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showConfigWarning);
    } else {
      showConfigWarning();
    }
  }

  g.EF = EF;
})(window);
