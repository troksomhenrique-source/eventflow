# EventFlow REV5 — Equipe

## Instalação

1. No Supabase, abra **SQL Editor**.
2. Execute o arquivo `database/MIGRAR_EVENTFLOW_REV5_EQUIPE.sql` uma única vez.
3. Publique todos os arquivos deste pacote no lugar da versão anterior.
4. No navegador, pressione `Ctrl + F5` após a publicação.

## O que foi adicionado

- Página **Equipe**, logo abaixo de **Logística** no menu.
- Cadastro de equipe interna e freelancers.
- Nome, RG, CPF, veículo, cachê, funções e nota interna.
- Vínculo opcional entre uma pessoa interna e sua conta do EventFlow.
- Desativação sem apagar o histórico das escalas.
- Seleção da equipe cadastrada dentro da Logística.
- Aviso **“Já está no evento X”** quando a pessoa já está escalada no mesmo dia.
- Confirmação antes de permitir uma escala duplicada.

## Permissões

Somente usuários de **Gerência** e **Produção** acessam o cadastro e os dados pessoais da equipe. A Logística continua disponível conforme as permissões já existentes.

## Ajuste visual REV5.1

- Clientes cadastrados em tabela compacta com pesquisa.
- Eventos ativos em tabela por mês, com pesquisa e filtro de status.
- Equipe em tabela compacta, mantendo as ações de edição e desativação.
- Formulário da Equipe corrigido para não ocupar a tela inteira.
