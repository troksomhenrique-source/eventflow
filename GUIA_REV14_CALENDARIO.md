# EventFlow REV14 — Calendário padronizado

Esta revisão não precisa de migração SQL. Publique os arquivos do pacote substituindo os anteriores.

## O que mudou

- Um único calendário para Agenda, CRM, Vendas, Notas/Tarefas e Reembolsos.
- Datas apresentadas no padrão brasileiro `dd/mm/aaaa`.
- Seleção de data e hora sem as colunas estreitas do calendário nativo do navegador.
- Navegação por mês, destaque para hoje e botões rápidos **Hoje**, **Amanhã** e **+7 dias**.
- Botão para limpar a seleção e botão claro para aplicar data e hora.
- Layout em formato de painel no computador e de folha inferior no celular.
- Campos criados dinamicamente, como a edição de eventos na Agenda, também recebem o novo calendário.
- Os valores internos continuam no formato esperado pelo banco, sem alterar o salvamento existente.

## Arquivos principais

- `ef-calendar.js`
- `ef-calendar.css`
- `ef-auth.js`

As páginas com datas foram atualizadas para carregar a revisão 34 do arquivo de autenticação.
