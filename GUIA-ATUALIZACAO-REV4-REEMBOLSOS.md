# EventFlow REV4 — notas e reembolsos

## Instalação

1. Faça backup do banco e do site atual.
2. Confirme que as migrações REV2 e REV3 foram executadas.
3. No **SQL Editor** do Supabase, execute inteiro:

   `database/MIGRAR_EVENTFLOW_REV4_REEMBOLSOS.sql`

4. Depois do SQL terminar sem erro, publique os arquivos do pacote, incluindo:

   - `reembolsos.html`
   - `ef-auth.js`
   - `ef-ui.js`

## Permissões

- **Produção:** visualiza os lançamentos da empresa, cria solicitações e pode excluir apenas uma solicitação própria ainda pendente.
- **Gerência:** visualiza e cria, aprova, rejeita, marca como reembolsado e exclui lançamentos que ainda não foram pagos.
- **Estoque:** não visualiza o módulo.
- Usuários inativos não acessam dados nem comprovantes.

## Dados registrados

- Evento relacionado.
- Categoria e descrição do gasto.
- Forma de pagamento utilizada.
- Quem realizou o gasto.
- Quem receberá o reembolso.
- Dia, hora, local e valor.
- Até 10 comprovantes JPG, PNG, WEBP ou PDF, com até 10 MB cada.
- Situação financeira e observação da Gerência.

Um lançamento precisa ser aprovado antes de ser marcado como reembolsado. Depois
de pago, o registro fica bloqueado contra mudança de status ou exclusão, preservando
o histórico financeiro e a auditoria.

## Teste recomendado

1. Entre como Produção, abra **Reembolsos** e crie um lançamento com duas imagens.
2. Confirme que as imagens abrem somente enquanto o usuário estiver autenticado.
3. Entre como Gerência, aprove o lançamento e depois marque como reembolsado.
4. Confira os totais nos indicadores superiores.
5. Entre como Estoque e confirme que o módulo não aparece e que o endereço direto redireciona.
6. Crie um lançamento de teste e exclua; confirme que os arquivos também sumiram do bucket `reembolsos-notas`.
