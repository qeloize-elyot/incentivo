// Banco de dados simulado localmente (Estado Global do App)
let appState = {
    saldoLuxo: 300.00,
    ingressos: 3,
    mascoteEmoji: '🐱'
};

// URL do Filme guardado no Google Drive
const urlFilme = "https://drive.google.com/file/d/1cpHkt1yJx9CK3zW4OVhI0WkrqAb-cNXB/view?usp=drivesdk";

// Função para navegar entre as abas do app de forma suave
function switchSection(sectionId) {
    // Esconde todas as seções
    document.querySelectorAll('.app-section').forEach(section => {
        section.classList.remove('active');
    });
    // Remove o destaque de todos os botões da barra de navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Ativa a seção e o botão correspondente
    document.getElementById(sectionId).classList.add('active');
    document.getElementById('btn-' + sectionId).classList.add('active');
}

// Função executada quando o usuário consulta a inteligência artificial
function enviarMensagemIA() {
    const inputItem = document.getElementById('input-item');
    const inputValor = document.getElementById('input-valor');
    const chatWindow = document.getElementById('chat-window');

    const item = inputItem.value.trim();
    const valor = parseFloat(inputValor.value);

    // Validação simples dos campos digitados
    if (!item || isNaN(valor) || valor <= 0) {
        alert("Ops! Por favor, digite o nome do item e um valor válido. 🌸");
        return;
    }

    // Renderiza o balão de mensagem do Usuário na tela
    chatWindow.innerHTML += `
        <div class="msg message-user">
            Estou pensando em comprar um(a) <strong>${item}</strong> por <strong>R$ ${valor.toFixed(2)}</strong>. O que acha?
        </div>
    `;

    // Reseta os campos de input
    inputItem.value = "";
    inputValor.value = "";
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Simula a resposta da IA inteligente após 1 segundo
    setTimeout(() => {
        let respostaIA = "";
        
        if (valor > appState.saldoLuxo) {
            // Cenário 1: Não há saldo suficiente no Balde de Luxo
            respostaIA = `Humm... Analisei aqui e o valor de <strong>R$ ${valor.toFixed(2)}</strong> ultrapassa o que você tem disponível no seu balde de Luxo Livre agora. Se você comprar, vai acabar prejudicando seus objetivos maiores. Que tal segurar o impulso e esperar o mês que vem? 🐾`;
            mudarHumorMascote('😟', '"Puxa, cuidado com os gastos extras!"');
        } else {
            // Cenário 2: Há saldo suficiente, a IA faz a reflexão consultiva
            const sobra = appState.saldoLuxo - valor;
            respostaIA = `Olha, você tem saldo disponível no balde de Luxo! Mas lembre-se: se comprar isso agora, restarão apenas <strong>R$ ${sobra.toFixed(2)}</strong> para todos os seus outros luxos do mês. Se esse item for mudar seu dia e te fizer muito feliz, vá em frente! Se for apenas um impulso passageiro, que tal guardar esse dinheiro para ganhar um ingresso de cinema? 🌸`;
            mudarHumorMascote('🤔', '"Pense bem antes de usar seu saldo livre!"');
        }

        // Renderiza o balão de resposta da IA na tela
        chatWindow.innerHTML += `<div class="msg message-ia">${respostaIA}</div>`;
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 1000);
}

// Função utilitária para atualizar as reações e frases do mascote
function mudarHumorMascote(emoji, statusTexto) {
    document.getElementById('mascote').innerText = emoji;
    document.getElementById('mascote-status').innerText = statusTexto;
}

// Lógica de liberação e desconto de ingressos da aba de Cinema
function abrirCinema() {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('main-video');

    if (appState.ingressos >= 1) {
        // Deduz um ingresso do saldo atual do usuário
        appState.ingressos -= 1;
        document.getElementById('qtd-ingressos').innerText = appState.ingressos;

        // Abre a janela de cinema (Modal Overlay)
        modal.style.display = 'flex';
        
        // Exibe o aviso clássico do Google Drive em consoles/logs
        console.log("Carregando o link de Zootopia: " + urlFilme);
        alert("Pipoca pronta! 🍿 Se por acaso o vídeo não carregar na tela, é porque o link direto do Drive bloqueou visualizações externas do navegador. No projeto definitivo com o Firebase Storage, isso rodará perfeitamente!");
    } else {
        alert("Poxa... parece que seus ingressos acabaram! Controle mais alguns impulsos com a IA para coletar novos ingressos de ouro. 🎟️🌸");
    }
}

// Função para interromper o vídeo e fechar a tela de cinema
function fecharCinema() {
    const player = document.getElementById('main-video');
    player.pause(); // Pausa a reprodução para não continuar saindo som ao fechar
    document.getElementById('video-modal').style.display = 'none';
}
