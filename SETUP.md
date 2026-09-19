# EventFlow — Setup

Este pacote foi limpo para instalação nova.

Use somente os arquivos da pasta `database/`:

1. `RESET_EVENTFLOW.sql`
2. opcionalmente `RESET_TOTAL_COM_AUTH.sql`
3. `INSTALAR_EVENTFLOW.sql`

Depois siga `GUIA-INSTALACAO-LIMPA.md`.

Não use schemas antigos de fases; eles foram removidos deste pacote para não haver conflito de ordem/migração.


Storage: crie manualmente no Dashboard um bucket privado `chat-anexos` (25 MB). O Supabase não permite limpeza segura dessas tabelas via DELETE SQL direto.
