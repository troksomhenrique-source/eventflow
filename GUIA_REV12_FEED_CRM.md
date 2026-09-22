# EventFlow REV12 — Feed, comunicação e CRM visual

## Instalação

No Supabase, abra **SQL Editor → New query** e execute as migrações na ordem:

1. `database/MIGRAR_EVENTFLOW_REV10_ERP_CRM.sql`, caso ainda não tenha executado;
2. `database/MIGRAR_EVENTFLOW_REV11_COMUNICACAO.sql`, caso ainda não tenha executado;
3. `database/MIGRAR_EVENTFLOW_REV12_FEED.sql`.

Depois, publique todos os arquivos desta revisão no GitHub Pages. A REV12 pode ser executada novamente com segurança para atualizar políticas e funções.

## CRM

- O pipeline agora permite arrastar o lead entre as etapas no computador.
- No celular, a etapa continua sendo alterada pelo seletor dentro do lead.
- Ao abrir um lead que está em Briefing, Visita técnica, Projeto 3D ou Fechamento, a tela correspondente abre automaticamente.
- O briefing foi separado em Local e público, Estrutura e fornecedores, Soluções técnicas e Operação e restrições.
- Visita técnica aceita fotos e PDF, com galeria e prévia das imagens.
- Projeto 3D aceita formatos CAD, modelagem, render e documentos.
- O limite dos arquivos do CRM passou para 100 MB por arquivo.
- Toda mudança de etapa gera uma atualização automática no Feed.

## Comunicação

- Nova página **Feed**, visível na seção Comunicação da barra lateral.
- Publicações, avisos, comentários, reações, anexos, itens fixados e vínculos com eventos, tarefas e leads.
- Novas tarefas, eventos e mudanças de etapa do CRM aparecem automaticamente no Feed.
- O Feed mostra próximos eventos e tarefas pendentes.
- O Chat ganhou painel de participantes, link compartilhável, pesquisa, chamada por Google Meet e atalhos para transformar conversa em nota ou tarefa.
- A tela de Tarefas ganhou visual de tabela com prazo, criador, responsável e prioridade, mantendo uma versão compacta no celular.

## Teste rápido

1. Abra **CRM Comercial**, crie um lead e arraste o cartão para **Briefing**.
2. Abra o lead, preencha e salve o briefing.
3. Mova-o para **Visita técnica** e envie uma foto.
4. Mova-o para **Projeto 3D** e envie um arquivo de projeto.
5. Abra **Comunicação → Feed** e confirme as atualizações automáticas.
6. Crie uma publicação, comente e anexe um arquivo.
7. No celular, confirme o Feed, o Chat e a troca de etapa pelo seletor.
