# EventFlow REV11 — Comunicação

## Instalação

1. Se ainda não executou a REV10, execute primeiro `database/MIGRAR_EVENTFLOW_REV10_ERP_CRM.sql`.
2. No Supabase SQL Editor, execute `database/MIGRAR_EVENTFLOW_REV11_COMUNICACAO.sql`.
3. Publique os arquivos desta revisão no GitHub Pages.

## O que mudou

- A barra lateral agora possui uma área própria chamada **Comunicação**.
- Chat e chamadas permite pesquisar conversas, criar Google Meet e transformar qualquer mensagem em tarefa ou nota.
- O texto que estiver sendo digitado também pode ser salvo diretamente como tarefa ou nota.
- Tarefas podem ter responsável, prioridade, detalhes, prazo, evento e lead, todos opcionais.
- Notas podem ter título, evento, lead e destaque fixado, todos opcionais.
- Notas e tarefas criadas pelo chat mantêm um atalho para voltar à conversa original.
- A página de notas e tarefas possui busca e filtros.
- Os formulários do CRM, atividades, notas, tarefas e grupos não exigem preenchimento de título ou descrição.

Quando nenhum título for informado, o sistema usa um nome neutro e permite continuar sem bloquear o usuário.
