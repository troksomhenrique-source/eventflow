# EventFlow REV13 — Feed, Chat, Notas, Tarefas e CRM

## Instalação

Esta revisão parte da REV12. No **Supabase → SQL Editor**, execute:

`database/MIGRAR_EVENTFLOW_REV13_USABILIDADE.sql`

Depois publique todos os arquivos do pacote no GitHub Pages, substituindo os anteriores.

Se a instalação ainda não chegou à REV12, execute antes, nesta ordem:

1. `database/MIGRAR_EVENTFLOW_REV10_ERP_CRM.sql`
2. `database/MIGRAR_EVENTFLOW_REV11_COMUNICACAO.sql`
3. `database/MIGRAR_EVENTFLOW_REV12_FEED.sql`
4. `database/MIGRAR_EVENTFLOW_REV13_USABILIDADE.sql`

## O que mudou

### Feed

- Usa toda a largura disponível.
- Próximos eventos e tarefas ficam em uma faixa horizontal superior.
- Em monitores grandes, as publicações usam duas colunas.
- As fotos de perfil aparecem nas publicações e comentários.

### Chat

- Lista de conversas e caixa de mensagens maiores.
- A conversa mais recente abre automaticamente no computador.
- Em celular e tablet, a conversa ativa ocupa a tela inteira.
- Novo bloco **Meu perfil**, que permite enviar, trocar ou remover a foto.
- A foto aparece nas conversas privadas, cabeçalho, participantes e Feed.
- Limite de 5 MB, aceitando JPG, PNG, WEBP e GIF.

### Notas e tarefas

- A criação agora usa funções protegidas no banco em vez de depender de inserção direta.
- Tarefas e notas criadas na página ou pelo Chat usam o mesmo fluxo.
- Os vínculos com responsável, evento, lead e conversa são validados pela empresa.
- Os formulários exibem o erro real caso a migração não tenha sido executada.

### CRM

- Os cartões ficaram maiores e mantêm o arrastar e soltar.
- Cada cartão mostra a ação da etapa, uma prévia do último resumo e o botão **Abrir e editar**.
- Há resumo próprio em todas as etapas: Qualificação, Briefing, Visita técnica, Projeto 3D, Fechamento, Orçamento, Negociação, Ganho e Perdido.
- Briefing, VT, 3D e Fechamento continuam com suas telas e anexos completos.
- Clicar no botão do cartão abre diretamente a tela correta da etapa.

## Teste rápido

1. Em **Chat**, clique em **Meu perfil**, escolha uma foto e salve.
2. Crie uma tarefa e uma nota pela página **Notas e tarefas**.
3. Abra uma conversa e crie outra tarefa usando o botão do Chat.
4. No CRM, clique em **Abrir e editar**, salve um resumo e confira a prévia no cartão.
5. Arraste o lead para outra coluna e registre o resumo da nova etapa.
6. Abra o Feed e confira o layout horizontal e as fotos de perfil.
