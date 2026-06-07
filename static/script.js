const chatArea =
document.getElementById("chatArea")

const messageInput =
document.getElementById("messageInput")

const sendBtn =
document.getElementById("sendBtn")

const historyList =
document.getElementById("historyList")

const sidebar =
document.getElementById("sidebar")

const menuBtn =
document.getElementById("menuBtn")

const newChatBtn =
document.getElementById("newChatBtn")

// =========================================
// CHAT STORAGE
// =========================================

let chats = JSON.parse(

    localStorage.getItem("sunnbee_chats")

) || []

let currentChatId = null

// =========================================
// SAVE CHAT
// =========================================

function saveChats(){

    localStorage.setItem(

        "sunnbee_chats",

        JSON.stringify(chats)
    )
}

// =========================================
// CREATE NEW CHAT
// =========================================

function createNewChat(){

    const chatId =
    Date.now()

    const newChat = {

        id: chatId,

        title: "New Chat ☀️",

        messages: [

            {
                type:"bot",

                text:`
                Haiii bestieee ☀️💕<br>
                Aku SunnBee ✨<br><br>

                Temen ngobrol kamu yang:
                lucu,
                santai,
                dan siap nemenin yapping 😭💕
                `,

                emotion:"happy"
            }
        ]
    }

    chats.unshift(newChat)

    currentChatId =
    chatId

    saveChats()

    renderHistory()

    loadChat(chatId)
}

// =========================================
// LOAD CHAT
// =========================================

async function loadChat(chatId){

    currentChatId =
    chatId

    const chat =
    chats.find(
        c => c.id === chatId
    )

    if(!chat) return

    chatArea.innerHTML = ""

    for(const msg of chat.messages){

        await addMessageToUI(

            msg.text,

            msg.type,

            msg.emotion
        )
    }
}

// =========================================
// RENDER HISTORY
// =========================================

function renderHistory(){

    historyList.innerHTML = ""

    chats.forEach(chat => {

        const item =
        document.createElement("div")

        item.className =
        "history-item"

        item.innerText =
        chat.title

        item.onclick = () => {

            loadChat(chat.id)
        }

        historyList.appendChild(item)
    })
}

// =========================================
// TOGGLE SIDEBAR
// =========================================

menuBtn.onclick = () => {

    sidebar.classList.toggle("hide")
}

// =========================================
// NEW CHAT BUTTON
// =========================================

newChatBtn.onclick = () => {

    createNewChat()
}

// =========================================
// TYPEWRITER EFFECT
// =========================================

async function typeText(
    element,
    text,
    speed = 12
){

    let i = 0

    while(i < text.length){

        element.innerHTML +=
        text.charAt(i)

        i++

        await new Promise(resolve =>
            setTimeout(resolve, speed)
        )

        chatArea.scrollTop =
        chatArea.scrollHeight
    }
}

// =========================================
// ADD MESSAGE UI
// =========================================

async function addMessageToUI(

    text,
    type,
    emotion="happy"

){

    // USER
    if(type === "user"){

        const div =
        document.createElement("div")

        div.className =
        "user-message"

        div.innerHTML =
        text

        chatArea.appendChild(div)
    }

    // BOT
    else{

        const wrapper =
        document.createElement("div")

        wrapper.className =
        "bot-wrapper"

        const avatar =
        document.createElement("img")

        avatar.src =
        `/static/reactions/${emotion}.png`

        avatar.className =
        "bot-avatar"

        const message =
        document.createElement("div")

        message.className =
        "bot-message"

        wrapper.appendChild(avatar)

        wrapper.appendChild(message)

        chatArea.appendChild(wrapper)

        await typeText(
            message,
            text
        )
    }

    chatArea.scrollTop =
    chatArea.scrollHeight
}

// =========================================
// SAVE MESSAGE TO CHAT
// =========================================

function saveMessage(

    text,
    type,
    emotion="happy"

){

    const chat =
    chats.find(

        c => c.id === currentChatId
    )

    if(!chat) return

    // UPDATE TITLE
    if(

        type === "user" &&

        chat.title === "New Chat ☀️"
    ){

        chat.title =
        text.substring(0,25)
    }

    chat.messages.push({

        text,
        type,
        emotion
    })

    saveChats()

    renderHistory()
}

// =========================================
// SEND MESSAGE
// =========================================

async function sendMessage(){

    const message =
    messageInput.value.trim()

    if(!message) return

    // USER MESSAGE
    await addMessageToUI(

        message,

        "user"
    )

    saveMessage(

        message,

        "user"
    )

    messageInput.value = ""

    // =========================================
    // TYPING BUBBLE
    // =========================================

    const typing =
    document.createElement("div")

    typing.className =
    "bot-wrapper"

    typing.id =
    "typingBubble"

    typing.innerHTML = `

        <img
        src="/static/reactions/typing.png"
        class="bot-avatar">

        <div class="bot-message">

            SunnBee lagi ngetik...

            <div class="typing-dots">

                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>
    `

    chatArea.appendChild(typing)

    chatArea.scrollTop =
    chatArea.scrollHeight

    try{

        const response =
        await fetch("/chat",{

            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                message:message
            })
        })

        const data =
        await response.json()

        // REMOVE TYPING
        document
        .getElementById("typingBubble")
        .remove()

        // BOT MESSAGE
        await addMessageToUI(

            data.reply,

            "bot",

            data.emotion
        )

        saveMessage(

            data.reply,

            "bot",

            data.emotion
        )

    }catch(error){

        document
        .getElementById("typingBubble")
        .remove()

        await addMessageToUI(

            "yah error bestie 😭",

            "bot",

            "sad"
        )
    }
}

// =========================================
// BUTTON
// =========================================

sendBtn.onclick =
sendMessage

// =========================================
// ENTER
// =========================================

messageInput.addEventListener(

    "keypress",

    function(e){

        if(e.key === "Enter"){

            sendMessage()
        }
    }
)

// =========================================
// INITIALIZE
// =========================================

if(chats.length === 0){

    createNewChat()
}

else{

    renderHistory()

    loadChat(chats[0].id)
}