
# EventFlow — Revisão Vendas V7

## Correções funcionais
- Campo de cliente agora funciona de forma híbrida:
  - pode digitar o nome livremente;
  - pode selecionar um cliente já cadastrado e os dados são preenchidos.
- Corrigido carregamento de clientes: removido filtro em coluna inexistente (`ativo`).
- Corrigido insert de orçamentos: suporte a `cliente_id` no banco.
- Corrigido insert/update de itens de orçamento: suporte a `observacoes` no banco.

## Melhorias de layout
- Formulário de novo orçamento reorganizado em grade mais limpa.
- Ações do topo viraram botões.
- Bloco de criação mais claro e mais intuitivo para uso operacional.
