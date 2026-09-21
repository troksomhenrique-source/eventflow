// EventFlow — Edge Function "delete-company"
// Publicar no Supabase com exatamente o nome: delete-company

import { createClient } from 'jsr:@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'Método não permitido.' }, 405);

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: callerData, error: callerError } = await callerClient.auth.getUser();
    if (callerError || !callerData.user) return json({ error: 'Não autenticado.' }, 401);

    const { data: profile } = await callerClient
      .from('profiles')
      .select('role,ativo')
      .eq('id', callerData.user.id)
      .maybeSingle();
    if (!profile || profile.role !== 'owner' || profile.ativo === false) {
      return json({ error: 'Somente o Owner ativo pode excluir empresas.' }, 403);
    }

    const body = await req.json();
    const empresaId = String(body.empresa_id || '').trim();
    const confirmacao = String(body.confirmacao || '');
    if (!empresaId || !confirmacao) {
      return json({ error: 'Empresa e confirmação são obrigatórias.' }, 400);
    }

    // A RPC faz a exclusão transacional no banco e devolve as contas que
    // pertenciam à empresa. Ela roda com o JWT do caller e reconfirma o Owner.
    const { data: removed, error: removeError } = await callerClient.rpc(
      'owner_excluir_empresa',
      { p_empresa_id: empresaId, p_confirmacao: confirmacao },
    );
    if (removeError) return json({ error: removeError.message }, 400);

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const warnings: string[] = [];
    let arquivosRemovidos = 0;

    for (const bucket of ['chat-anexos', 'reembolsos-notas']) {
      try {
        const paths = await listFilesRecursively(adminClient, bucket, empresaId);
        for (let i = 0; i < paths.length; i += 100) {
          const batch = paths.slice(i, i + 100);
          const { error } = await adminClient.storage.from(bucket).remove(batch);
          if (error) throw error;
          arquivosRemovidos += batch.length;
        }
      } catch (error) {
        warnings.push(`Não foi possível limpar o bucket ${bucket}: ${messageOf(error)}`);
      }
    }

    let usuariosRemovidos = 0;
    const userIds = Array.isArray(removed?.user_ids) ? removed.user_ids : [];
    for (const userId of userIds) {
      const { error } = await adminClient.auth.admin.deleteUser(String(userId));
      if (error) warnings.push(`Conta ${userId}: ${error.message}`);
      else usuariosRemovidos += 1;
    }

    return json({
      ok: true,
      empresa: { id: removed.empresa_id, nome: removed.empresa_nome },
      usuarios_removidos: usuariosRemovidos,
      arquivos_removidos: arquivosRemovidos,
      warnings,
    });
  } catch (error) {
    return json({ error: messageOf(error) }, 500);
  }
});

async function listFilesRecursively(
  client: ReturnType<typeof createClient>,
  bucket: string,
  prefix: string,
): Promise<string[]> {
  const files: string[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await client.storage.from(bucket).list(prefix, {
      limit: 100,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) {
      // Bucket ainda não instalado nessa versão do projeto: não é falha fatal.
      if (/not found|does not exist/i.test(error.message)) return files;
      throw error;
    }
    const entries = data ?? [];
    for (const entry of entries) {
      const path = `${prefix}/${entry.name}`;
      if (entry.id) files.push(path);
      else files.push(...await listFilesRecursively(client, bucket, path));
    }
    if (entries.length < 100) break;
    offset += entries.length;
  }
  return files;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
