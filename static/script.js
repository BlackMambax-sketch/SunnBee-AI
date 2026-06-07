const chatArea = document.getElementById("chatArea");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const historyList = document.getElementById("historyList");
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const newChatBtn = document.getElementById("newChatBtn");

// TOGGLE SIDEBAR (Responsive Desktop/Mobile Logic)
menuBtn.onclick = (e) => {
    e.stopPropagation();
    if(window.innerWidth > 768) {
        sidebar.classList.toggle("hide");
    } else {
        sidebar.classList.toggle("show-mobile");
    }
}

// CLOSE SIDEBAR ON CLICK OUTSIDE (Khusus Mobile)
document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 && sidebar.classList.contains("show-mobile")) {
        // Jika yang diklik bukan di dalam sidebar
        if (!sidebar.contains(e.target) && e.target !== menuBtn) {
            sidebar.classList.remove("show-mobile");
        }
    }
});

// NEW CHAT
newChatBtn.onclick = () => {
    chatArea.innerHTML = `
        <div class="bot-wrapper">
            <img src="/static/reactions/happy.png" class="bot-avatar">
            <div class="bot-message">
                Haiii bestieee ☀️💕<br>
                Aku SunnBee ✨
            </div>
        </div>
    `;
    
    // Auto-tutup sidebar setelah klik New Chat (khusus mobile)
    if(window.innerWidth <= 768) {
        sidebar.classList.remove("show-mobile");
    }
}

// ADD HISTORY
function addHistory(text){
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerText = text.substring(0, 30);
    historyList.prepend(item);
}

// ADD MESSAGE
function addMessage(text, type, emotion="happy"){
    // USER
    if(type === "user"){
        const div = document.createElement("div");
        div.className = "user-message";
        div.innerHTML = text;
        chatArea.appendChild(div);
    }
    // BOT
    else{
        const wrapper = document.createElement("div");
        wrapper.className = "bot-wrapper";
        wrapper.innerHTML = `
            <img src="/static/reactions/${emotion}.png" class="bot-avatar">
            <div class="bot-message">
                ${text}
            </div>
        `;
        chatArea.appendChild(wrapper);
    }
    chatArea.scrollTop = chatArea.scrollHeight;
}

// SEND MESSAGE
async function sendMessage(){
    const message = messageInput.value.trim();
    if(!message) return;

    // USER MESSAGE
    addMessage(message, "user");
    addHistory(message);
    messageInput.value = "";

    // TYPING BUBBLE
    const typing = document.createElement("div");
    typing.className = "bot-wrapper";
    typing.id = "typingBubble";
    typing.innerHTML = `
        <img src="/static/reactions/typing.gif" class="bot-avatar">
        <div class="bot-message">
            SunnBee lagi mikirrr ✨
        </div>
    `;
    chatArea.appendChild(typing);
    chatArea.scrollTop = chatArea.scrollHeight;

    try{
        const response = await fetch("/chat",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({ message:message })
        });
        
        const data = await response.json();

        // REMOVE TYPING
        document.getElementById("typingBubble").remove();

        // BOT MESSAGE
        addMessage(data.reply, "bot", data.emotion);

    }catch(error){
        document.getElementById("typingBubble").remove();
        addMessage("yah error bestie 😭", "bot", "sad");
    }
}

// ACTION BUTTON & ENTER KEY
sendBtn.onclick = sendMessage;

messageInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
});