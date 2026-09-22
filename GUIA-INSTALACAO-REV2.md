# EventFlow REV2 — instalação da atualização

> Este pacote também contém a REV3 do chat e a REV4 de reembolsos. Em uma
> instalação nova, execute as migrações na ordem REV2 → REV3 → REV4, seguindo
> os guias correspondentes.

## 1. Faça backup

Antes de atualizar, gere um backup do banco e preserve a versão atual do site.

## 2. Atualize o banco primeiro

No projeto Supabase `peotlzjahxlpexvardhk`, abra **SQL Editor**, crie uma nova consulta e execute inteiro:

`database/MIGRAR_EVENTFLOW_REV2_AUDITORIA.sql`

O script usa uma transação. Se qualquer instrução falhar, nenhuma alteração parcial será mantida.

## 3. Confira cancelamentos antigos

Depois da migração, execute:

```sql
select id, evento_id, status, estoque_baixado_em, estoque_devolvido_em
from public.ordens_servico
where status = 'cancelada'
  and estoque_baixado_em is not null
  and estoque_devolvido_em is null;
```

Se retornar linhas, não ajuste o saldo automaticamente. São OSs canceladas antes desta correção e podem ter sido compensadas manualmente. Reconcilie cada uma com o estoque físico.

## 4. Publique os arquivos do site

Substitua os HTMLs, `ef-auth.js`, `ef-ui.js`, `ef-ui.css` e `ef-config.js` pelos arquivos deste pacote. Mantenha a Edge Function `create-user` publicada.

## 5. Teste obrigatório

1. Entrar como Owner e abrir Administração.
2. Criar uma empresa de teste e um usuário de cada perfil.
3. Confirmar que usuário bloqueado perde o acesso.
4. Cadastrar um item com saldo 2 e adicioná-lo numa área.
5. Gerar a OS e confirmar saldo 1.
6. Cancelar a OS e confirmar saldo 2.
7. Gerar outra OS, encerrar o evento e confirmar saldo 2.
8. Tentar reservar o mesmo veículo no mesmo dia em dois eventos; o segundo deve falhar.
9. Cancelar um orçamento aprovado e confirmar que a OV também fica cancelada.
10. Tentar reativar a OV diretamente; o banco deve bloquear enquanto o orçamento estiver cancelado.

## Observações

- O bucket privado `chat-anexos` e as políticas necessárias são criados/atualizados pela migração.
- O limite de anexos do chat fica em 25 MB.
- A chave pública do frontend pode permanecer no `ef-config.js`. Nunca coloque `service_role`, senha do banco ou tokens administrativos no site.
