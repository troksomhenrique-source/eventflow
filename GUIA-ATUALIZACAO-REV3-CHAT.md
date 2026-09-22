# EventFlow REV3 — atualização do chat

> Para instalar também o módulo de reembolsos desta versão do pacote, siga
> `GUIA-ATUALIZACAO-REV4-REEMBOLSOS.md` depois de concluir esta etapa.

## Ordem correta

1. Faça backup do banco e dos arquivos atuais do site.
2. Confirme que a migração da REV2 já foi executada.
3. No Supabase, abra **SQL Editor** e execute inteiro:

   `database/MIGRAR_EVENTFLOW_REV3_CHAT.sql`

4. Depois que o SQL terminar sem erro, publique o novo `chat.html`.

## O que foi adicionado

- Troca e remoção da foto do grupo.
- Edição do nome do grupo.
- Foto exibida na lista e no cabeçalho da conversa.
- Exclusão completa do grupo, mensagens, áudios e anexos.
- Bloqueio de novas mensagens durante a exclusão.
- Atualização em tempo real do nome e da foto para os participantes.
- Gerenciamento permitido somente para quem criou o grupo.

## Teste recomendado

1. Crie um grupo com duas contas.
2. Como criador, abra o menu `⋮`, troque a foto e altere o nome.
3. Na segunda conta, confirme que nome e foto atualizam.
4. Envie texto, anexo e áudio.
5. Apague o grupo digitando `APAGAR` na confirmação.
6. Confirme que o grupo desapareceu das duas contas.
7. No bucket `chat-anexos`, confirme que a pasta correspondente ao grupo ficou vazia.

Fotos de grupo aceitas: JPG, PNG, WEBP e GIF, com até 5 MB.
