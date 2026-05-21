# Deploy no Dokploy

## Configuração Rápida

Este projeto está configurado para fazer deploy automático no Dokploy. Siga os passos abaixo:

### Pré-requisitos
- Conta no Dokploy
- Docker instalado localmente (opcional, apenas para testes)
- Git configurado

### Passos para Deploy

1. **No Dokploy Dashboard:**
   - Crie um novo projeto
   - Selecione "Docker" como tipo de aplicação
   - Conecte seu repositório GitHub
   - Selecione a branch `master`

2. **Configurações Recomendadas:**
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Port:** 3000
   - **Memory:** 512MB (mínimo) ou 1GB (recomendado)
   - **CPU:** 0.5 (mínimo) ou 1 (recomendado)

3. **Variáveis de Ambiente:**
   Configure no Dokploy as seguintes variáveis (se necessário):
   ```
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   ```

### Arquivos de Configuração

- **Dockerfile:** Multi-stage build otimizado para Next.js
- **.dockerignore:** Arquivos excluídos do build Docker
- **dokploy.json:** Configuração específica para Dokploy

### Testes Locais (Opcional)

Para testar o Docker localmente antes de fazer deploy:

```bash
# Build da imagem
docker build -t eng-senac-frontend .

# Rodar o container
docker run -p 3000:3000 eng-senac-frontend
```

A aplicação estará disponível em `http://localhost:3000`

### Monitoramento

O Dokploy vai automaticamente:
- Reconstruir a imagem a cada push na branch `master`
- Fazer health checks a cada 30 segundos
- Reiniciar a aplicação se der erro

### Troubleshooting

**Erro de porta em uso:**
- Dokploy gerencia automaticamente - não há conflito

**Build falhando:**
- Verifique o log de build no Dokploy
- Certifique-se que `package-lock.json` está no repositório

**Aplicação não iniciando:**
- Verifique as variáveis de ambiente
- Confira os logs de saída da aplicação
- Aumente o `startPeriod` se estiver demorando para iniciar

### Atualizações Contínuas

Após configurar, qualquer push para a branch `master` vai disparar automaticamente:
1. Clone do repositório
2. Build da imagem Docker
3. Deployment da nova versão
4. Health checks

---

Para mais informações, acesse: https://dokploy.com/docs
