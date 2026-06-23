const { default: makeWASocket, useMultiFileAuthState } = require('baileys');
const mongoose = require('mongoose');

// חיבור ל-MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        auth: state,
        // מחקנו את printQRInTerminal כי הוא דפוק
    });

    // כאן הקסם: אם צריך QR, הוא ידפיס אותו ללוגים
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('סרוק את ה-QR הבא בווטסאפ:');
            console.log(qr); // זה ידפיס את ה-QR ב-Logs
        }

        if (connection === 'close') {
            startBot();
        } else if (connection === 'open') {
            console.log('Bot is online!');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        await sock.sendMessage(msg.key.remoteJid, { text: 'הבוט פעיל!' });
    });
}

startBot();
