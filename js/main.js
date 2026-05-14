// ============================================================
// AI CHATBOT - Gemini Powered
// Instructions: Paste this code at the BOTTOM of your main.js
// Replace YOUR_GEMINI_API_KEY with your actual key from:
// https://aistudio.google.com/app/apikey
// ============================================================

const GEMINI_API_KEY = 'AIzaSyDNiGi6FzQSbUs72cI-xSjtLdm4GytN16g'; // <-- Apna key yahan daalo
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// ---- Chatbot HTML inject karo ----
const chatbotHTML = `
<div id="ai-chatbot-wrapper">
  <!-- Toggle Button -->
  <button id="chatbot-toggle-btn" aria-label="Open AI Chat">
    <span class="chat-icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </span>
    <span class="close-icon" style="display:none;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </span>
  </button>

  <!-- Chat Window -->
  <div id="chatbot-window" class="chatbot-hidden">
    <div id="chatbot-header">
      <div class="chatbot-avatar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <div class="chatbot-header-info">
        <h4>AI Assistant</h4>
        <span class="chatbot-status">● Online</span>
      </div>
      <button id="chatbot-clear-btn" title="Clear chat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </div>

    <div id="chatbot-messages">
      <div class="chat-message bot-message">
        <div class="message-bubble">
          👋 Hello! Main aapka AI Assistant hoon. Kuch bhi poochh sakte hain!
        </div>
      </div>
    </div>

    <div id="chatbot-input-area">
      <textarea id="chatbot-input" placeholder="Apna message likhein..." rows="1"></textarea>
      <button id="chatbot-send-btn" aria-label="Send">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  </div>
</div>
`;

// ---- CSS inject karo ----
const chatbotCSS = `
  #ai-chatbot-wrapper {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 9999;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }

  /* Toggle Button */
  #chatbot-toggle-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6c63ff, #4ecdc4);
    border: none;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(108, 99, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin-left: auto;
  }
  #chatbot-toggle-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 28px rgba(108, 99, 255, 0.7);
  }

  /* Chat Window */
  #chatbot-window {
    width: 360px;
    height: 500px;
    background: var(--chatbot-bg, #ffffff);
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.18);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-bottom: 16px;
    border: 1px solid var(--chatbot-border, #e8e8e8);
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform-origin: bottom right;
  }
  #chatbot-window.chatbot-hidden {
    opacity: 0;
    transform: scale(0.7) translateY(20px);
    pointer-events: none;
  }

  /* Dark Theme Support */
  [data-theme="dark"] #chatbot-window {
    --chatbot-bg: #1e1e2e;
    --chatbot-border: #333355;
    --chatbot-header-bg: #2a2a3e;
    --chatbot-msg-bg: #2a2a3e;
    --chatbot-text: #e0e0f0;
    --chatbot-input-bg: #2a2a3e;
    --chatbot-input-border: #444466;
    --bot-bubble-bg: #2a2a3e;
    --user-bubble-bg: linear-gradient(135deg, #6c63ff, #4ecdc4);
  }
  [data-theme="light"] #chatbot-window,
  #chatbot-window {
    --chatbot-bg: #ffffff;
    --chatbot-border: #e8e8e8;
    --chatbot-header-bg: #f8f8ff;
    --chatbot-msg-bg: #f4f4f8;
    --chatbot-text: #1a1a2e;
    --chatbot-input-bg: #f8f8ff;
    --chatbot-input-border: #ddd;
    --bot-bubble-bg: #f0f0fa;
    --user-bubble-bg: linear-gradient(135deg, #6c63ff, #4ecdc4);
  }

  /* Header */
  #chatbot-header {
    background: var(--chatbot-header-bg, #f8f8ff);
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--chatbot-border, #e8e8e8);
  }
  .chatbot-avatar {
    width: 38px;
    height: 38px;
    background: linear-gradient(135deg, #6c63ff, #4ecdc4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }
  .chatbot-header-info { flex: 1; }
  .chatbot-header-info h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: var(--chatbot-text, #1a1a2e);
  }
  .chatbot-status {
    font-size: 11px;
    color: #4caf50;
    font-weight: 500;
  }
  #chatbot-clear-btn {
    background: none;
    border: none;
    color: var(--chatbot-text, #666);
    cursor: pointer;
    opacity: 0.5;
    padding: 4px;
    border-radius: 6px;
    transition: opacity 0.2s, background 0.2s;
  }
  #chatbot-clear-btn:hover { opacity: 1; background: rgba(108,99,255,0.1); }

  /* Messages Area */
  #chatbot-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--chatbot-msg-bg, #f4f4f8);
    scroll-behavior: smooth;
  }
  #chatbot-messages::-webkit-scrollbar { width: 4px; }
  #chatbot-messages::-webkit-scrollbar-thumb { background: #6c63ff55; border-radius: 4px; }

  /* Message Bubbles */
  .chat-message { display: flex; gap: 8px; max-width: 100%; }
  .chat-message.user-message { flex-direction: row-reverse; }

  .message-bubble {
    max-width: 80%;
    padding: 10px 14px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;
    color: var(--chatbot-text, #1a1a2e);
  }
  .bot-message .message-bubble {
    background: var(--bot-bubble-bg, #f0f0fa);
    border-bottom-left-radius: 4px;
  }
  .user-message .message-bubble {
    background: var(--user-bubble-bg, linear-gradient(135deg, #6c63ff, #4ecdc4));
    color: #ffffff !important;
    border-bottom-right-radius: 4px;
  }

  /* Typing Indicator */
  .typing-indicator {
    display: flex;
    gap: 5px;
    padding: 10px 14px;
    background: var(--bot-bubble-bg, #f0f0fa);
    border-radius: 18px;
    border-bottom-left-radius: 4px;
    max-width: 70px;
  }
  .typing-dot {
    width: 8px; height: 8px;
    background: #6c63ff;
    border-radius: 50%;
    animation: typingBounce 1.2s ease infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-6px); opacity: 1; }
  }

  /* Input Area */
  #chatbot-input-area {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    padding: 12px 16px;
    background: var(--chatbot-input-bg, #f8f8ff);
    border-top: 1px solid var(--chatbot-border, #e8e8e8);
  }
  #chatbot-input {
    flex: 1;
    border: 1.5px solid var(--chatbot-input-border, #ddd);
    border-radius: 14px;
    padding: 10px 14px;
    font-size: 14px;
    resize: none;
    outline: none;
    background: var(--chatbot-bg, #fff);
    color: var(--chatbot-text, #1a1a2e);
    max-height: 100px;
    transition: border-color 0.2s;
    font-family: inherit;
  }
  #chatbot-input:focus { border-color: #6c63ff; }
  #chatbot-input::placeholder { color: #aaa; }

  #chatbot-send-btn {
    width: 42px; height: 42px;
    background: linear-gradient(135deg, #6c63ff, #4ecdc4);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 10px rgba(108,99,255,0.4);
  }
  #chatbot-send-btn:hover { transform: scale(1.1); box-shadow: 0 4px 16px rgba(108,99,255,0.6); }
  #chatbot-send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* Mobile Responsive */
  @media (max-width: 480px) {
    #ai-chatbot-wrapper { bottom: 16px; right: 16px; }
    #chatbot-window { width: calc(100vw - 32px); height: 70vh; }
  }
`;

// ---- CSS document mein inject karo ----
(function injectChatbotStyles() {
  const style = document.createElement('style');
  style.id = 'chatbot-styles';
  style.textContent = chatbotCSS;
  document.head.appendChild(style);
})();

// ---- HTML document mein inject karo ----
(function injectChatbotHTML() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = chatbotHTML.trim();
  document.body.appendChild(wrapper.firstChild);
})();

// ---- Chatbot Logic ----
let chatHistory = []; // Conversation history track karne ke liye
let isChatOpen = false;

const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSendBtn = document.getElementById('chatbot-send-btn');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotClearBtn = document.getElementById('chatbot-clear-btn');

// Chat window toggle
chatbotToggleBtn.addEventListener('click', () => {
  isChatOpen = !isChatOpen;
  chatbotWindow.classList.toggle('chatbot-hidden', !isChatOpen);
  
  // Icon toggle
  chatbotToggleBtn.querySelector('.chat-icon').style.display = isChatOpen ? 'none' : 'flex';
  chatbotToggleBtn.querySelector('.close-icon').style.display = isChatOpen ? 'flex' : 'none';
  
  if (isChatOpen) chatbotInput.focus();
});

// Enter key se send karo
chatbotInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Auto-resize textarea
chatbotInput.addEventListener('input', () => {
  chatbotInput.style.height = 'auto';
  chatbotInput.style.height = Math.min(chatbotInput.scrollHeight, 100) + 'px';
});

chatbotSendBtn.addEventListener('click', sendMessage);

// Chat clear karo
chatbotClearBtn.addEventListener('click', () => {
  chatHistory = [];
  chatbotMessages.innerHTML = `
    <div class="chat-message bot-message">
      <div class="message-bubble">Chat clear ho gayi! Kuch naya poochh sakte hain. 😊</div>
    </div>`;
});

// Message add karo UI mein
function addMessage(text, role) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${role === 'user' ? 'user-message' : 'bot-message'}`;
  
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.innerHTML = text.replace(/\n/g, '<br>');
  
  msgDiv.appendChild(bubble);
  chatbotMessages.appendChild(msgDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return msgDiv;
}

// Typing indicator
function showTyping() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message bot-message';
  typingDiv.id = 'typing-indicator';
  typingDiv.innerHTML = `
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  chatbotMessages.appendChild(typingDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

// Gemini API call
async function callGeminiAPI(userMessage) {
  // History mein add karo
  chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

  const payload = {
    contents: chatHistory,
    systemInstruction: {
      parts: [{
        text: "Aap ek helpful, friendly AI assistant hain. Hinglish (Hindi + English mix) ya pure English mein jawab do based on user ki language. Concise aur clear rahein."
      }]
    },
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  };

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'API error');
  }

  const data = await response.json();
  const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Koi jawab nahi mila.';

  // History mein bot response add karo
  chatHistory.push({ role: 'model', parts: [{ text: replyText }] });

  return replyText;
}

// Main send function
async function sendMessage() {
  const message = chatbotInput.value.trim();
  if (!message) return;

  // Input clear karo
  chatbotInput.value = '';
  chatbotInput.style.height = 'auto';
  chatbotSendBtn.disabled = true;

  // User message show karo
  addMessage(message, 'user');

  // Typing indicator show karo
  showTyping();

  try {
    const reply = await callGeminiAPI(message);
    removeTyping();
    addMessage(reply, 'bot');
  } catch (error) {
    removeTyping();
    let errorMsg = '⚠️ Kuch error hua. ';
    if (error.message.includes('API_KEY') || error.message.includes('key')) {
      errorMsg += 'Apna Gemini API key check karein - chatbot-addon.js mein GEMINI_API_KEY replace karein.';
    } else {
      errorMsg += error.message;
    }
    addMessage(errorMsg, 'bot');
  } finally {
    chatbotSendBtn.disabled = false;
    chatbotInput.focus();
  }
}

// ============================================================
// END OF CHATBOT CODE
// ============================================================
