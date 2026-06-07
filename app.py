from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os

# =========================================
# LOAD ENV
# =========================================

load_dotenv()

# =========================================
# FLASK
# =========================================

app = Flask(__name__)
CORS(app)

# =========================================
# TOKEN
# =========================================

HF_TOKEN = os.getenv("HF_TOKEN")

# =========================================
# CHECK TOKEN
# =========================================

if not HF_TOKEN:
    print("❌ HF_TOKEN tidak ditemukan")
    exit()

# =========================================
# AI CLIENT
# =========================================

client = InferenceClient(
    api_key=HF_TOKEN
)

# =========================================
# MODEL
# =========================================

MODEL = "meta-llama/Llama-3.1-8B-Instruct"

print("===================================")
print("☀️ SUNNBEE AI READY")
print("===================================")
print(f"🔥 MODEL: {MODEL}")
print("===================================")

# =========================================
# HOME
# =========================================

@app.route("/")
def home():

    return render_template("index.html")

# =========================================
# DETECT EMOTION
# =========================================

def detect_emotion(text):

    text = text.lower()

    if (
        "wkwk" in text or
        "haha" in text or
        "lol" in text or
        "ngakak" in text
    ):
        return "laugh"

    elif (
        "sedih" in text or
        "capek" in text or
        "nangis" in text or
        "kecewa" in text
    ):
        return "sad"

    elif (
        "sayang" in text or
        "love" in text or
        "❤️" in text or
        "💕" in text
    ):
        return "love"

    elif (
        "marah" in text or
        "kesel" in text or
        "anjir" in text
    ):
        return "angry"

    elif (
        "bingung" in text or
        "hmm" in text or
        "hah" in text
    ):
        return "confused"

    elif (
        "kaget" in text or
        "serius" in text
    ):
        return "shocked"

    return "happy"

# =========================================
# CHAT API
# =========================================

@app.route("/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json()

        user_message = data.get(
            "message",
            ""
        ).strip()

        # VALIDASI
        if user_message == "":

            return jsonify({
                "reply": "pesannya kosong bestie 😭",
                "emotion": "confused"
            })

        print(f"💬 USER: {user_message}")

        # =========================================
        # AI RESPONSE
        # =========================================

        response = client.chat_completion(

            model=MODEL,

            messages=[

                {
                    "role": "system",

                    "content": """
Kamu adalah SunnBee ☀️✨

SunnBee adalah AI companion yang:
- super imut
- lucu
- playful
- Gen Z banget
- expressive
- hangat seperti matahari pagi
- suka emoji
- ngobrol kayak bestie sendiri

Kepribadian:
- santai
- natural
- gak formal
- manusia banget
- wholesome
- suka becanda
- supportive
- comforting

Aturan penting:
- Adaptasi gaya chat user
- Kalau user santai → ikut santai
- Kalau user formal → lebih rapi
- Jangan terlalu panjang
- Jangan seperti customer service
- Pakai slang Gen Z secukupnya
- Pakai emoji natural

Contoh gaya:

"halooo bestieee ☀️✨"

"jir semangat ya 😭"

"aww sini cerita 😔"

"ANJAYYY 😭💀"

Jawaban harus terasa seperti teman online lucu yang hidup.
"""
                },

                {
                    "role": "user",

                    "content": user_message
                }
            ],

            max_tokens=200,

            temperature=0.9
        )

        # =========================================
        # BOT REPLY
        # =========================================

        bot_reply = (
            response
            .choices[0]
            .message
            .content
        )

        # =========================================
        # EMOTION DETECTION
        # =========================================

        emotion = detect_emotion(bot_reply)

        print(f"🤖 SUNNBEE: {bot_reply}")
        print(f"🎭 EMOTION: {emotion}")

        return jsonify({

            "reply": bot_reply,

            "emotion": emotion
        })

    except Exception as e:

        print("===================================")
        print("❌ ERROR")
        print(e)
        print("===================================")

        return jsonify({

            "reply":
            f"yah error bestie 😭\n{str(e)}",

            "emotion":
            "sad"
        })

# =========================================
# HEALTH CHECK
# =========================================

@app.route("/health")
def health():

    return jsonify({

        "status": "online",

        "model": MODEL,

        "ai_name": "SunnBee"
    })

# =========================================
# RUN
# =========================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True
    )