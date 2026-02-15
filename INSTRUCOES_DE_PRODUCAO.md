
# Guia de Publicação - Madeireira Pindorama

Este guia descreve como levar o projeto do ambiente de desenvolvimento para um domínio profissional.

## 1. Preparação do Repositório (GitHub)
1. Crie uma conta em [github.com](https://github.com).
2. Crie um novo repositório chamado `madeireira-pindorama`.
3. Faça o commit e push do seu código.

## 2. Configuração da Hospedagem (Firebase Hosting)
1. Vá ao [Console do Firebase](https://console.firebase.google.com/).
2. Ative o **Hosting** e siga o fluxo para conectar seu domínio.

## 3. ⚠️ IMPORTANTE: Regras de Segurança (Firestore)
Para resolver o erro `code=permission-denied`, você precisa autorizar o site a ler os dados:

1. No Console do Firebase, vá em **Firestore Database** no menu lateral.
2. Clique na aba **"Rules" (Regras)** no topo.
3. Substitua o conteúdo pelo seguinte código para permitir leitura pública:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Permite que qualquer pessoa leia os produtos e configurações (necessário para o site)
       match /{document=**} {
         allow read: if true;
         // Protege a escrita: Apenas você poderá alterar dados pelo Painel ADM futuramente
         // (Para teste inicial, você pode usar: allow write: if true; mas lembre-se de restringir depois)
         allow write: if false; 
       }
     }
   }
   ```
4. Clique em **"Publish" (Publicar)**. O erro desaparecerá em instantes.

## 4. Segurança da API Key (IA Gemini)
No ambiente de produção (GitHub), adicione sua `API_KEY` nos **Secrets** das Actions para que o consultor de IA funcione com segurança.

---
*Gerado por seu Engenheiro de Software Sênior.*
