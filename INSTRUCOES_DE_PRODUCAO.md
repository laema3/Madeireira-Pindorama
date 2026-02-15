
# Guia de Configuração - Madeireira Pindorama

Siga estes passos para ativar o banco de dados e conectar ao seu site.

## 1. No Console do Firebase (Google)
1. **Criar Projeto**: [console.firebase.google.com](https://console.firebase.google.com/) -> Adicionar Projeto.
2. **Ativar Firestore**: Menu Lateral -> Firestore Database -> Criar banco de dados.
   - **Localização**: `southamerica-east1` (São Paulo) ou `us-east1`.
   - **Regras**: Iniciar em "Modo de Teste".
3. **Obter Chaves**: 
   - Clique na Engrenagem (Configurações do Projeto).
   - Na aba "Geral", role até "Seus aplicativos" e clique no ícone `</>`.
   - Copie os dados do objeto `firebaseConfig`.

## 2. No seu Código (Editor)
Abra o arquivo `firebaseConfig.ts` e substitua os valores:
```typescript
const firebaseConfig = {
  apiKey: "SUA_CHAVE_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  // ... cole o restante aqui
};
```

## 3. Liberar Acesso (Segurança)
Para que o site funcione sem erros de permissão, vá na aba **"Rules"** dentro do Firestore e cole:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true; // Qualquer um pode ver os produtos
      allow write: if true; // Por enquanto, liberar escrita para você configurar o site
    }
  }
}
```
*Nota: Após configurar o site, mude `allow write: if true` para `false` ou adicione autenticação.*

## 4. IA Gemini
O consultor de IA utiliza a chave `process.env.API_KEY`. Certifique-se de ter uma chave ativa em [ai.google.dev](https://ai.google.dev/).

---
*Dúvidas? Consulte seu Engenheiro de Software.*
