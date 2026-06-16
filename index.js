const { default: makeWASocket, useMultiFileAuthState } = require('@baileys/baileys');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');

// חיבור ל-MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            console.log('Connection closed, reconnecting...');
            startBot();
        } else if (connection === 'open') {
            console.log('Bot is online!');
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        console.log('Received message:', text);
        
        // כאן יבוא הלוגיקה של ה-AI והתגובה שלך...
        await sock.sendMessage(msg.key.remoteJid, { text: 'הבוט פעיל בענן!' });
    });
}

startBot();
