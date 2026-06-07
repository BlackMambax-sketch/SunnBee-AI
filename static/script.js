const chatArea =
    document.getElementById("chatArea");

const input =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

const sidebar =
    document.getElementById("sidebar");

const menuBtn =
    document.getElementById("menuBtn");

const mobileOverlay =
    document.getElementById("mobileOverlay");

// MENU

menuBtn.addEventListener("click", () => {

    sidebar.classList.toggle("active");

    mobileOverlay.classList.toggle(
        "active"
    );
});

mobileOverlay.addEventListener("click", () => {

    sidebar.classList.remove("active");

    mobileOverlay.classList.remove(
        "active"
    );
});

// SEND MESSAGE

async function sendMessage() {

    const message =
        input.value.trim();

    if(message === "") return;

    // USER MESSAGE

    const userDiv =
        document.createElement("div");

    userDiv.className =
        "user-message";

    userDiv.innerText =
        message;

    chatArea.appendChild(userDiv);

    // TYPING

    const typingRow =
        document.createElement("div");

    typingRow.className =
        "message-row";

    typingRow.id =
        "typingBubble";

    typingRow.innerHTML = `

        <img class="reaction-img"
             src="/static/reactions/typing.jpg">

        <div class="bot-message">
            SunnBee lagi mikirrr... ☀️
        </div>
    `;

    chatArea.appendChild(
        typingRow
    );

    chatArea.scrollTop =
        chatArea.scrollHeight;

    input.value = "";

    // FETCH

    const response =
        await fetch("/chat", {

            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                message:message
            })
        });

    const data =
        await response.json();

    // REMOVE TYPING

    typingRow.remove();

    // BOT MESSAGE

    const botRow =
        document.createElement("div");

    botRow.className =
        "message-row";

    botRow.innerHTML = `

        <img class="reaction-img"
             src="/static/reactions/happy.jpg">

        <div class="bot-message">
            ${data.reply}
        </div>
    `;

    chatArea.appendChild(
        botRow
    );

    chatArea.scrollTop =
        chatArea.scrollHeight;
}

sendBtn.addEventListener(
    "click",
    sendMessage
);

input.addEventListener(
    "keypress",
    (e) => {

        if(e.key === "Enter") {

            sendMessage();
        }
    }
);