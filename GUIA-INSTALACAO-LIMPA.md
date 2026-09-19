# EventFlow — instalação limpa

## 1. Configuração do frontend

Abra `ef-config.js` e confirme que `url` e `anonKey` pertencem ao projeto Supabase que você vai usar.

## 2. Zerar a base

No Supabase → SQL Editor, rode primeiro:

`database/RESET_EVENTFLOW.sql`

Isso apaga a estrutura e os dados do EventFlow, mas preserva os usuários do Supabase Authentication.

Se você quer apagar **também todos os logins** e o projeto Supabase é exclusivo do EventFlow, rode em seguida:

`database/RESET_TOTAL_COM_AUTH.sql (apenas orientação; não apaga Auth via SQL)`

> Esse segundo arquivo é irreversível e apaga todos os usuários de Authentication.

## 3. Criar a base do zero

No SQL Editor, rode inteiro:

`database/INSTALAR_EVENTFLOW.sql`

Esse é o único schema necessário no pacote limpo. Ele cria empresas, perfis, estoque, agenda, áreas, vendas, OS, notas, logística, chat, Storage e as funções de estoque.

## 4. Criar o primeiro owner

Supabase → Authentication → Users → Add user. Crie seu usuário com e-mail e senha e confirme o e-mail.

Depois rode no SQL Editor, trocando os valores:

```sql
insert into public.profiles (id, nome, email, role, empresa_id)
select id, 'Seu Nome', email, 'owner', null
from auth.users
where email = 'seu-email@exemplo.com';
```

## 5. Publicar a Edge Function

Publique `create-user.ts` como uma Edge Function chamada exatamente `create-user`.

Ela é usada pelo owner para criar os usuários das empresas.

## 6. Rodar o site

Não abra os HTMLs por `file://`. Na pasta do projeto, use um servidor local, por exemplo:

```bash
python -m http.server 8080
```

Depois abra:

`http://localhost:8080/login.html`

## 7. Teste mínimo antes de produção

1. Login do owner.
2. Criar uma empresa.
3. Criar um usuário `gerencia`.
4. Cadastrar um item no estoque.
5. Criar um evento.
6. Adicionar o item numa lista de área e confirmar a queda de `quantidade_disponivel`.
7. Remover o item e confirmar a devolução.
8. Reservar novamente e usar Logística → Finalizar evento para devolver o material.
9. Enviar uma mensagem/anexo no Chat.
10. Testar acesso com perfis `producao` e `estoque`.


## Storage do chat

No Supabase Dashboard, vá em **Storage** e crie um bucket **privado** chamado `chat-anexos`, com limite de **25 MB**. Não tente apagar `storage.objects` ou `storage.buckets` diretamente por SQL; use o Dashboard ou a Storage API.
