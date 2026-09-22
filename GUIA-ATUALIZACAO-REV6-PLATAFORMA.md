# EventFlow REV6 — Plataforma e login

## 1. Atualizar o banco

No Supabase, abra **SQL Editor**, cole todo o arquivo
`database/MIGRAR_EVENTFLOW_REV6_PLATAFORMA.sql` e clique em **Run**.

## 2. Criar a função de exclusão

No Supabase, abra **Edge Functions**, crie uma função chamada exatamente
`delete-company`, substitua o conteúdo pelo arquivo `delete-company.ts` e publique.

Mantenha a verificação de JWT ligada. As variáveis `SUPABASE_URL`,
`SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` são fornecidas pelo Supabase.

## 3. Publicar o site

Envie os arquivos atualizados, principalmente:

- `plataforma.html`
- `login.html`
- `ef-auth.js`

Depois, entre com a conta Owner. A lista de empresas será carregada
automaticamente. A exclusão exige duas confirmações, incluindo digitar exatamente
o nome da empresa, e remove dados, contas de acesso e anexos vinculados.
