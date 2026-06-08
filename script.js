// Variáveis de Controle do Usuário Logado
let currentUser = null;
let tipoEdicaoAtual = ''; 

// Estrutura Padrão para novos usuários cadastrados
const defaultData = {
    saldoObjetivos: 500.00,
    saldoLuxo: 200.00,
    ingressos: 1,
    mascoteEmoji: '🐱',
    statusMascote: '"Oie! Vamos economizar juntos hoje?"'
};

// Verificação de Sessão ao Iniciar a Página
window.onload = function() {
    const session = localStorage.getItem('activeUser');
    if (session) {
        currentUser = session;
        loadUserData();
        showApp();
    }
};

// --- SISTEMA DE LOGIN E CADASTRO REAL (Via LocalStorage) ---
function efetuarLogin() {
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const senha = document.getElementById('login-senha').value.trim();

    if (!email || !senha) {
        alert("Preencha todos os campos para entrar! 💕");
        return;
    }

    let userKey = `user_${btoa(email)}`;
    let storedUser = localStorage.getItem(userKey);

    if (!storedUser) {
        // Se o usuário não existe, faz o cadastro automático com valores iniciais
        localStorage.setItem(userKey, JSON.stringify(defaultData));
        alert("Conta criada com sucesso com o saldo padrão! Bem-vindo(a) ✨");
    }

    localStorage.setItem('activeUser', userKey);
    currentUser = userKey;
    loadUserData();
    showApp();
}

function efetuarLogout() {
    localStorage.removeItem('activeUser');
    currentUser = null;
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('app-nav').style.display = 'none';
    document.getElementById('app-container').style.display = 'none';
}

function showApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-nav').style.display = 'flex';
    document.getElementById('app-container').style.display = 'block';
    switchSection('dashboard');
}

// Carregar e Salvar dados do Usuário Atual
function loadUserData() {
    let data = JSON.parse(localStorage.getItem(currentUser));
    document.getElementById('txt-objetivos').innerText = `R$ ${data.saldoObjetivos.toFixed(2)}`;
    document.getElementById('txt-luxo').innerText = `R$ ${data.saldoLuxo.toFixed(2)}`;
    document.getElementById('qtd-ingressos').innerText = data.ingressos;
    document.getElementById('mascote').innerText = data.mascoteEmoji;
    document.getElementById('mascote-status').innerText = data.statusMascote;
}

function saveUserData(data) {
    localStorage.setItem(currentUser, JSON.stringify(data));
    loadUserData();
}

// --- CONTROLE DE NAVEGAÇÃO ---
function switchSection(sectionId) {
    document.querySelectorAll('.app-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.getElementById('btn-' + sectionId).classList.add('active');
}

// --- ALTERAÇÃO DE SALDOS (DIFERENCIAL PEDIDO) ---
function abrirModalEdicao(tipo) {
    tipoEdicaoAtual = tipo;
    document.getElementById('modal-edit-title').innerText = tipo === 'objetivos' ? "Editar Meta dos Sonhos" : "Ajustar Limite de Luxo";
    document.getElementById('edit-modal').style.display = 'flex';
}

function fecharModalEdicao() {
    document.getElementById('edit-modal').style.display = 'none';
    document.getElementById('input-novo-valor').value = '';
}

function salvarNovoValor() {
    const novoValor = parseFloat(document.getElementById('input-novo-valor').value);
    if (isNaN(novoValor) || novoValor < 0) {
        alert("Insira um valor numérico válido!");
        return;
    }

    let data = JSON.parse(localStorage.getItem(currentUser));
    if (tipoEdicaoAtual === 'objetivos') {
        data.saldoObjetivos = novoValor;
    } else {
        data.saldoLuxo = novoValor;
    }
    
    saveUserData(data);
    fecharModalEdicao();
}

// --- LÓGICA RÍGIDA DA IA (Foco em Poupança) ---
function enviarMensagemIA() {
    const inputItem = document.getElementById('input-item');
    const inputValor = document.getElementById('input-valor');
    const chatWindow = document.getElementById('chat-window');

    const item = inputItem.value.trim();
    const valor = parseFloat(inputValor.value);

    if (!item || isNaN(valor) || valor <= 0) return;

    chatWindow.innerHTML += `<div class="msg message-user">Quero comprar um(a) ${item} por R$ ${valor.toFixed(2)}. Posso?</div>`;
    inputItem.value = ""; inputValor.value = "";
    chatWindow.scrollTop = chatWindow.scrollHeight;

    setTimeout(() => {
        let data = JSON.parse(localStorage.getItem(currentUser));
        let resposta = "";

        // Regra de Rigidez 1: Se ultrapassar o limite livre de luxo
        if (valor > data.saldoLuxo) {
            resposta = `🛑 <strong>NEGADO!</strong> Comprar esse(a) ${item} estoura completamente o seu Balde de Luxo. Fazer isso é sabotar seu próprio futuro e roubar dinheiro dos seus sonhos. Não compre!`;
            data.mascoteEmoji = '😟';
            data.statusMascote = `"Você quase fez uma besteira financeira impulsiva..."`;
        } 
        // Regra de Rigidez 2: Tem margem, mas a compra compromete uma fatia agressiva (mais de 40% do luxo do mês)
        else if (valor > (data.saldoLuxo * 0.4)) {
            resposta = `⚠️ <strong>CUIDADO!</strong> Embora você tenha R$ ${data.saldoLuxo.toFixed(2)} livre, esse item consome mais de 40% de todo o seu orçamento de vaidade do mês inteiro. Só porque você tem o dinheiro, não significa que deve torrá-lo. Recomendo guardar metade disso para seu balde de Objetivos Futuros e repensar em 3 dias.`;
            data.mascoteEmoji = '🤔';
            data.statusMascote = `"A IA te salvou de gastar quase metade do seu dinheiro livre!"`;
        } 
        // Regra de Rigidez 3: Compra pequena autorizada
        else {
            resposta = `✅ <strong>Aprovado com moderação.</strong> É um valor pequeno frente ao seu saldo. Mas lembre-se: pequenas compras acumuladas criam grandes rombos. Anote o gasto!`;
            data.mascoteEmoji = '🐱';
            data.statusMascote = `"Tudo sob controle por aqui!"`;
        }

        chatWindow.innerHTML += `<div class="msg message-ia">${resposta}</div>`;
        chatWindow.scrollTop = chatWindow.scrollHeight;
        saveUserData(data);
    }, 800);
}

// --- AUDITORIA REAL DE EXTRATO (Simulação Inteligente de Análise) ---
function processarExtrato() {
    const fileInput = document.getElementById('file-extrato');
    const resultadoBox = document.getElementById('extrato-resultado');

    if (fileInput.files.length === 0) {
        alert("Por favor, selecione um arquivo de extrato fictício para realizar a leitura!");
        return;
    }

    resultadoBox.style.display = 'block';
    resultadoBox.innerHTML = "<em>Analisando transações do extrato bancário... 🔍</em>";

    setTimeout(() => {
        let data = JSON.parse(localStorage.getItem(currentUser));
        
        // Simulação de verificação: 50% de chance de achar um gasto oculto não planejado
        const mentiuNoGasto = Math.random() > 0.5;

        if (mentiuNoGasto) {
            resultadoBox.className = "resultado-box error-style";
            resultadoBox.style.borderLeftColor = "#E53935";
            resultadoBox.style.backgroundColor = "#FFEBEE";
            resultadoBox.innerHTML = `❌ <strong>Auditoria Concluída:</strong> Detectamos transações na categoria 'Luxo' que não foram validadas no painel previamente. Você gastou escondido da IA! Como punição, você perdeu o bônus de consistência desta semana. Seja honesto com seu dinheiro!`;
            data.mascoteEmoji = '😿';
            data.statusMascote = `"Estou desapontado... encontramos gastos ocultos no seu extrato."`;
        } else {
            resultadoBox.className = "resultado-box success-style";
            resultadoBox.style.borderLeftColor = "#2E7D32";
            resultadoBox.style.backgroundColor = "#E8F5E9";
            resultadoBox.innerHTML = `🎉 <strong>Extrato Validado!</strong> Meus parabéns! Suas movimentações reais batem perfeitamente com o combinado no app. Sua disciplina valeu a pena: <strong>+1 Ingresso de Ouro</strong> adicionado ao seu saldo!`;
            data.ingressos += 1;
            data.mascoteEmoji = '👑';
            data.statusMascote = `"Incrível! Você provou no extrato que é mestre do dinheiro!"`;
        }
        saveUserData(data);
    }, 1500);
}

// --- ABA DO CINEMA ---
function abrirCinema() {
    let data = JSON.parse(localStorage.getItem(currentUser));
    if (data.ingressos >= 1) {
        data.ingressos -= 1;
        saveUserData(data);
        document.getElementById('video-modal').style.display = 'flex';
        document.getElementById('main-video').src = "https://drive.google.com/file/d/1cpHkt1yJx9CK3zW4OVhI0WkrqAb-cNXB/view?usp=drivesdk";
    } else {
        alert("Sem ingressos! Passe pela auditoria de extrato sem fraudes para ganhar.");
    }
}

function fecharCinema() {
    const video = document.getElementById('main-video');
    video.pause();
    document.getElementById('video-modal').style.display = 'none';
}
