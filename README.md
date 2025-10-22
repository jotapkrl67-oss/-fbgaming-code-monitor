# 📧 FBGaming Code Monitor

Monitor de códigos de autenticação em tempo real para mail.tm

## 🚀 Características

- ✅ Conecta na API do mail.tm
- ✅ Busca códigos automaticamente a cada 10 segundos
- ✅ Interface moderna e responsiva
- ✅ Copia código com um clique
- ✅ Deleta código manualmente
- ✅ Suporte a dark mode
- ✅ Sem dependências externas
- ✅ Funciona em qualquer navegador moderno

## 📁 Estrutura do Projeto

```
fbgaming-complete/
├── index.html          # Arquivo HTML principal
├── css/
│   └── style.css       # Estilos CSS
├── js/
│   └── app.js          # Lógica JavaScript
├── assets/             # Pasta para assets (ícones, imagens)
└── README.md           # Este arquivo
```

## 🔧 Como Usar

### Opção 1: Abrir Localmente

1. Baixe todos os arquivos
2. Abra `index.html` no navegador
3. Pronto! Funciona offline

### Opção 2: Hospedar no Vercel

1. Faça upload para um repositório GitHub
2. Conecte ao Vercel
3. Deploy automático

### Opção 3: Hospedar em qualquer servidor

1. Faça upload dos arquivos para seu servidor
2. Acesse via navegador
3. Pronto!

## 📝 Credenciais Padrão

- **Email**: `fbgaminggmax@tiffincrane.com`
- **Senha**: `FBGAMINGGMAX`

> Você pode usar suas próprias credenciais do mail.tm

## 🔐 Segurança

- ✅ Credenciais armazenadas apenas no navegador (localStorage)
- ✅ Nenhum servidor intermediário
- ✅ HTTPS automático em deployments
- ✅ Sem tracking ou analytics
- ✅ Código-fonte aberto e auditável

## 🌐 Compatibilidade

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 📱 Responsivo

O site funciona perfeitamente em:
- Desktop
- Tablet
- Mobile

## 🎨 Customização

### Alterar Cores

Edite `css/style.css` e modifique as variáveis CSS:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* ... outras cores */
}
```

### Alterar Intervalo de Atualização

Edite `js/app.js` e procure por:

```javascript
this.updateInterval = setInterval(() => this.fetchCodes(), 10000); // 10 segundos
```

Altere `10000` para o intervalo desejado em milissegundos.

## 🐛 Troubleshooting

### "Falha na autenticação"

- Verifique email e senha
- Certifique-se de que a conta mail.tm existe
- Tente fazer login diretamente em mail.tm

### "Nenhum código encontrado"

- Verifique se há mensagens na caixa de entrada
- Aguarde alguns segundos para a próxima atualização automática
- Clique em "Conectar" novamente

### Códigos não atualizam

- Verifique sua conexão de internet
- Recarregue a página
- Tente fazer login novamente

## 📞 Suporte

Para problemas com a API do mail.tm, visite: https://mail.tm

## 📄 Licença

MIT

## 🙏 Créditos

Desenvolvido para monitorar códigos de autenticação do mail.tm

---

**Versão**: 1.0.0  
**Última atualização**: Outubro 2025

