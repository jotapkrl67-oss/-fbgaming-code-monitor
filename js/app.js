// ============================================
// FBGaming Code Monitor - Main Application
// ============================================

class CodeMonitor {
    constructor() {
        this.token = null;
        this.email = null;
        this.updateInterval = null;
        this.codes = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedCredentials();
    }

    setupEventListeners() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.login());
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Enter key to login
        document.getElementById('email')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });

        document.getElementById('password')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });
    }

    async login() {
        const emailInput = document.getElementById('email').value;
        const passwordInput = document.getElementById('password').value;

        if (!emailInput || !passwordInput) {
            this.showError('Preencha email e senha');
            return;
        }

        try {
            this.showError('');
            const response = await fetch('https://api.mail.tm/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    address: emailInput,
                    password: passwordInput
                })
            });

            if (!response.ok) {
                throw new Error('Falha na autenticação');
            }

            const data = await response.json();
            this.token = data.token;
            this.email = emailInput;

            // Save credentials
            localStorage.setItem('fbgaming_email', emailInput);
            localStorage.setItem('fbgaming_password', passwordInput);

            this.showLoginForm(false);
            this.showCodesContainer(true);
            document.getElementById('userEmail').textContent = this.email;

            // Start fetching codes
            this.fetchCodes();
            this.updateInterval = setInterval(() => this.fetchCodes(), 10000);
        } catch (error) {
            this.showError('Falha na autenticação. Verifique email e senha.');
            console.error('Login error:', error);
        }
    }

    async fetchCodes() {
        if (!this.token) return;

        try {
            const response = await fetch('https://api.mail.tm/messages?limit=50', {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao buscar mensagens');
            }

            const data = await response.json();
            const messages = data['hydra:member'] || [];

            this.codes = [];

            for (const msg of messages) {
                try {
                    const sourceResponse = await fetch(`https://api.mail.tm/sources/${msg.id}`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`,
                            'Accept': 'application/json'
                        }
                    });

                    if (sourceResponse.ok) {
                        const sourceData = await sourceResponse.json();
                        const htmlContent = sourceData.data || '';
                        const code = this.extractCode(htmlContent);

                        if (code) {
                            this.codes.push({
                                id: msg.id,
                                subject: msg.subject || 'Sem assunto',
                                code: code,
                                createdAt: msg.createdAt
                            });
                        }
                    }
                } catch (e) {
                    console.error('Erro ao processar mensagem:', e);
                }
            }

            this.displayCodes();
            this.updateTime();
        } catch (error) {
            console.error('Erro ao buscar códigos:', error);
        }
    }

    extractCode(html) {
        let decoded = html.replace(/=([0-9A-F]{2})/gi, (match, hex) => {
            return String.fromCharCode(parseInt(hex, 16));
        });

        const patterns = [
            /token[=:]\s*([0-9]{6})/,
            /code[=:]\s*([0-9]{6})/,
            /verificacao[:\s]+([0-9]{6})/i,
            /(\d{6})/
        ];

        for (const pattern of patterns) {
            const match = decoded.match(pattern);
            if (match) return match[1];
        }

        return null;
    }

    displayCodes() {
        const codesList = document.getElementById('codesList');
        const codeCount = document.getElementById('codeCount');

        codeCount.textContent = this.codes.length;

        if (this.codes.length === 0) {
            codesList.innerHTML = '<div class="empty-state">Nenhum código encontrado</div>';
            return;
        }

        codesList.innerHTML = this.codes.map(code => `
            <div class="code-card">
                <div class="code-info">
                    <div class="code-subject">${this.escapeHtml(code.subject)}</div>
                    <div class="code-value">${code.code}</div>
                    <div class="code-time">${new Date(code.createdAt).toLocaleTimeString('pt-BR')}</div>
                </div>
                <div class="code-actions">
                    <button class="btn-small" onclick="app.copyCode('${code.code}')">Copiar</button>
                    <button class="btn-small btn-danger" onclick="app.deleteCode('${code.id}')">Deletar</button>
                </div>
            </div>
        `).join('');
    }

    copyCode(code) {
        navigator.clipboard.writeText(code).then(() => {
            this.showNotification(`Código copiado: ${code}`);
        }).catch(() => {
            alert('Erro ao copiar código');
        });
    }

    async deleteCode(id) {
        if (!this.token) return;

        try {
            const response = await fetch(`https://api.mail.tm/messages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                this.fetchCodes();
            }
        } catch (error) {
            console.error('Erro ao deletar código:', error);
        }
    }

    logout() {
        this.token = null;
        this.email = null;
        this.codes = [];

        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.showLoginForm(true);
        this.showCodesContainer(false);
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        this.showError('');
    }

    showError(message) {
        const errorDiv = document.getElementById('error');
        if (message) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        } else {
            errorDiv.classList.remove('show');
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showLoginForm(show) {
        const loginForm = document.getElementById('loginForm');
        if (show) {
            loginForm.classList.remove('hidden');
        } else {
            loginForm.classList.add('hidden');
        }
    }

    showCodesContainer(show) {
        const container = document.getElementById('codesContainer');
        if (show) {
            container.classList.add('active');
        } else {
            container.classList.remove('active');
        }
    }

    updateTime() {
        const now = new Date();
        document.getElementById('lastUpdate').textContent = now.toLocaleTimeString('pt-BR');
    }

    loadSavedCredentials() {
        const savedEmail = localStorage.getItem('fbgaming_email');
        const savedPassword = localStorage.getItem('fbgaming_password');

        if (savedEmail) document.getElementById('email').value = savedEmail;
        if (savedPassword) document.getElementById('password').value = savedPassword;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CodeMonitor();
});

