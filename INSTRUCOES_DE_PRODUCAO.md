# Solução de Problemas: Bucket "Nenhum"

Se você vê a mensagem "Buckets: Nenhum", mas tem certeza que criou o bucket `images`, siga este guia definitivo:

## 1. Verificação de "Gêmeo Falso" (Project ID)
O Supabase cria um ID único para cada projeto. É comum termos dois projetos (um de teste e um real) e configurarmos o errado.

1. No seu navegador, entre no Supabase.
2. Olhe a URL na barra de endereços. Ela deve ser exatamente:
   `https://supabase.com/dashboard/project/qdigphmrabgzlbmvqqet/...`
3. Se o código depois de `/project/` **NÃO FOR** `qdigphmrabgzlbmvqqet`, você está no projeto errado.
4. Se for diferente, você precisa criar o bucket `images` **dentro desse outro projeto** que você está vendo no navegador, ou atualizar as chaves no código.

## 2. Teste Real (O "Tira-Teima")
No Painel ADM do site, eu adicionei um botão chamado **"FORÇAR TESTE DE GRAVAÇÃO"**.
- Às vezes, o Supabase esconde a lista de pastas, mas permite gravar dentro delas.
- Clique nesse botão. Se ele disser "GRAVAÇÃO OK", o site está funcionando perfeitamente, mesmo que a lista diga "Nenhum".

## 3. Checklist de "images" (Letras)
- O nome deve ser `images` (plural, tudo minúsculo).
- Se você escreveu `imagem`, `Images`, `IMAGENS` ou `images ` (com espaço no fim), **vai dar erro**.
- Delete e recrie se tiver qualquer dúvida.

## 4. A Policy "Mágica"
Se o teste de gravação falhar, o erro é na Policy. Vá em **Storage > Policies** no bucket `images`:
- Clique em **New Policy** -> **Full Customization**.
- **Allowed Operations**: Marque as 4 caixas (SELECT, INSERT, UPDATE, DELETE).
- **Target Roles**: Selecione `anon`.
- **Expression (USING e WITH CHECK)**: Digite apenas a palavra `true` (sem aspas).