# EventFlow V5 — correção funcional global

## Correção crítica
A sidebar global substituía os elementos antigos `#user-name`, `#user-role`, `#user-initials` e `#logout`, enquanto as páginas ainda dependiam desses IDs após `EF.init()`. Isso causava erro JavaScript e interrompia o carregamento de praticamente todas as telas.

A navegação global agora preserva esses IDs por compatibilidade e sincroniza o usuário depois de reconstruir a sidebar.

## Removido do produto
- Visão do projeto (`areas-do-projeto.html`)
- Painel de LED (`painel-de-led.html`)
- Infraestrutura (`infraestrutura.html`)

Os itens foram removidos da navegação e os arquivos de tela foram retirados do pacote.

## Banco
O instalador limpo também não cria mais a tabela exclusiva `evento_led_tabelas`.
