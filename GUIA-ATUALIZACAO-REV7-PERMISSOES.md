# EventFlow REV7 — permissões

## Alterações

- Estoque continua consultando a Agenda, mas não cadastra eventos.
- Estoque não vê nem acessa a página de Logística.
- Produção continua consultando a Agenda, mas não cadastra eventos.
- Produção continua com acesso à Logística.
- Gerência continua cadastrando eventos e acessando a Logística.

## Instalação

1. Execute `database/MIGRAR_EVENTFLOW_REV7_PERMISSOES.sql` no SQL Editor do Supabase.
2. Publique os arquivos do pacote no site.
3. Atualize o navegador com `Ctrl + F5` e entre novamente na conta que será testada.
