# EventFlow REV10 — instalação do ERP + CRM

Esta revisão adiciona o CRM comercial, briefing, arquivos de VT/3D/fechamento, reserva de estoque por período, identidade visual e integração individual com Google Agenda/Meet.

## 1. Atualizar o banco

No Supabase, abra **SQL Editor → New query**, cole todo o arquivo:

`database/MIGRAR_EVENTFLOW_REV10_ERP_CRM.sql`

Execute uma vez. A migração preserva os dados existentes.

## 2. Publicar o site

Substitua os arquivos do site pelos desta revisão e publique normalmente no GitHub Pages. A nova página é `crm.html` e aparece na barra lateral para Gerência e Produção.

## 3. Configurar Google Agenda e Meet

No Google Cloud Console:

1. Crie ou selecione um projeto.
2. Ative a **Google Calendar API**.
3. Configure a tela de consentimento OAuth. Durante testes, adicione os usuários em **Test users**.
4. Crie uma credencial **OAuth client ID → Web application**.
5. Em **Authorized redirect URIs**, cadastre exatamente:

   `https://peotlzjahxlpexvardhk.supabase.co/functions/v1/google-calendar`

No PowerShell, dentro da pasta do projeto, execute. Troque os valores entre `<...>`:

```powershell
npx.cmd supabase link --project-ref peotlzjahxlpexvardhk
npx.cmd supabase secrets set GOOGLE_CLIENT_ID="<client-id-do-google>"
npx.cmd supabase secrets set GOOGLE_CLIENT_SECRET="<client-secret-do-google>"
npx.cmd supabase secrets set GOOGLE_REDIRECT_URI="https://peotlzjahxlpexvardhk.supabase.co/functions/v1/google-calendar"
npx.cmd supabase secrets set GOOGLE_APP_URL="https://troksomhenrique-source.github.io/eventflow"
```

Gere duas chaves diferentes no PowerShell:

```powershell
$stateBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($stateBytes)
$stateSecret = [Convert]::ToBase64String($stateBytes)

$tokenBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($tokenBytes)
$tokenKey = [Convert]::ToBase64String($tokenBytes).TrimEnd('=').Replace('+','-').Replace('/','_')

npx.cmd supabase secrets set GOOGLE_STATE_SECRET="$stateSecret"
npx.cmd supabase secrets set GOOGLE_TOKEN_KEY="$tokenKey"
npx.cmd supabase functions deploy google-calendar --no-verify-jwt
```

Se o endereço publicado do site for diferente, altere `GOOGLE_APP_URL`. A URL deve ser apenas a pasta do site, sem `/crm.html` no final.

## 4. Como testar

1. Entre como Gerência ou Produção e abra **CRM Comercial**.
2. Crie um lead e preencha carga, evento e retorno.
3. Avance pelas etapas, salve o briefing e envie uma imagem em Visita Técnica.
4. Em Atividades, informe título/data e clique **Agendar com Google Meet**. No primeiro uso, conecte sua conta Google.
5. Abra **Orçamentos** pelo lead. Confirme se lead, carga e retorno foram preenchidos.
6. Adicione um equipamento. O orçamento cria reserva provisória; ao aprovar, a reserva passa a confirmada. Se faltar quantidade no período, a aprovação é bloqueada.
7. Em **Dados da empresa**, envie um logo PNG. Exporte orçamento, OS, descritivo e memorial para conferir a marca.

## Regras implementadas

- Orçamento aberto: reserva provisória e alerta de conflito projetado.
- Aprovado, pago parcial ou pago: reserva confirmada e bloqueio de sobreposição acima do estoque total.
- Cancelado: libera a reserva.
- Estoque finalizado no evento: encerra a reserva.
- Tokens Google: armazenados criptografados e acessados somente pela Edge Function.
- Cada usuário conecta a própria conta Google.
- Arquivos de CRM: bucket privado com acesso somente à Gerência e Produção da empresa.
- Exclusão definitiva de empresa: inclui os novos arquivos de CRM e identidade visual.
