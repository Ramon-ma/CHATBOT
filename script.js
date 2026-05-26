const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Função para adicionar mensagens na tela
function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerText = text;
    chatMessages.appendChild(messageDiv);
    
    // Rola o chat automaticamente para a última mensagem
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função que se comunica com a IA Local
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Adiciona a mensagem do usuário na tela e limpa o campo
    appendMessage(text, 'user');
    userInput.value = '';

    // Adiciona um balão temporário de "Pensando..."
    const thinkingMessage = document.createElement('div');
    thinkingMessage.classList.add('message', 'assistant');
    thinkingMessage.innerText = "Pensando...";
    chatMessages.appendChild(thinkingMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // Faz a chamada para a API local do Ollama usando o modelo leve de 1b
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3.2:1b', 
                messages: [{ role: 'user', content: text }],
                stream: false
            })
        });

        if (!response.ok) throw new Error('Erro na conexão com a IA.');

        const data = await response.json();
        
        // Remove o "Pensando..." e coloca a resposta real da IA
        thinkingMessage.remove();
        appendMessage(data.message.content, 'assistant');

    } catch (error) {
        thinkingMessage.remove();
        appendMessage('Erro: Certifique-se de que o comando "ollama serve" está ativo.', 'assistant');
        console.error(error);
    }
}

// Eventos de clique no botão e tecla Enter
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});