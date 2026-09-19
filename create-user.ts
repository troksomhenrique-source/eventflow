// ============================================================
// EventFlow — Edge Function "create-user"
// Só o owner (dono da plataforma) pode chamar. Cria a conta de login de
// alguém (com a senha que o owner escolheu, sem mandar e-mail nenhum) já
// dentro de uma empresa e com um nível (gerencia/producao/estoque).
//
// Como publicar (pelo painel do Supabase, sem precisar instalar nada):
// 1. Painel do Supabase → Edge Functions → Create a new function.
// 2. Nome da function: create-user
// 3. Cole todo o conteúdo deste arquivo no editor.
// 4. Deploy.
// 5. Em Edge Functions → create-user → Settings, confirme que as secrets
//    SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY existem (o Supabase já
//    injeta as duas automaticamente em toda function — normalmente não
//    precisa fazer nada aqui).
// ============================================================

import { createClient } from 'jsr:@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Cliente "como o usuário que chamou" — pra confirmar que é owner de verdade.
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: callerData, error: callerErr } = await callerClient.auth.getUser();
    if (callerErr || !callerData.user) {
      return json({ error: 'Não autenticado.' }, 401);
    }

    const { data: callerProfile } = await callerClient
      .from('profiles')
      .select('role')
      .eq('id', callerData.user.id)
      .maybeSingle();

    if (!callerProfile || callerProfile.role !== 'owner') {
      return json({ error: 'Só o dono da plataforma pode cadastrar contas novas.' }, 403);
    }

    // Cliente com privilégio total, só pra criar o novo usuário.
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const email = (body.email || '').trim();
    const nome = (body.nome || '').trim();
    const senha = body.senha || '';
    const role = body.role;
    const empresaId = body.empresa_id;

    if (!email || !nome) {
      return json({ error: 'Nome e e-mail são obrigatórios.' }, 400);
    }
    if (senha.length < 6) {
      return json({ error: 'A senha precisa ter pelo menos 6 caracteres.' }, 400);
    }
    if (!['gerencia', 'producao', 'estoque'].includes(role)) {
      return json({ error: 'Nível de acesso inválido.' }, 400);
    }
    if (!empresaId) {
      return json({ error: 'Escolha a empresa dessa pessoa.' }, 400);
    }

    // Confirma que a empresa existe de verdade antes de criar a conta.
    const { data: empresa } = await adminClient.from('empresas').select('id').eq('id', empresaId).maybeSingle();
    if (!empresa) {
      return json({ error: 'Empresa não encontrada.' }, 400);
    }

    // Cria a conta já com a senha escolhida pelo owner, sem e-mail nenhum.
    // email_confirm: true = a conta já nasce confirmada, a pessoa já entra na hora.
    const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
      user_metadata: { nome },
    });
    if (createErr) {
      return json({ error: createErr.message }, 400);
    }

    // Cria o perfil já com empresa e nível certos (não existe mais trigger
    // automática — o perfil nasce aqui, de propósito, sempre completo).
    const { error: insertErr } = await adminClient
      .from('profiles')
      .insert({ id: created.user!.id, nome, email, role, empresa_id: empresaId });

    if (insertErr) {
      // Não deixe uma conta de Auth órfã caso o perfil não possa ser criado.
      await adminClient.auth.admin.deleteUser(created.user!.id);
      return json({ error: insertErr.message }, 400);
    }

    return json({ ok: true, user_id: created.user!.id });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
