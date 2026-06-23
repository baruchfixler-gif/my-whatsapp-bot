const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('baileys');
const mongoose = require('mongoose');

// חיבור למונגו
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

async function startBot() {
    // שימוש באובייקט זיכרון פשוט במקום בתיקייה
    const state = { creds: { noiseKey: null, registryId: 0, advSecretKey: null, pairingMode: false }, keys: { get: () => null, set: () => {} } };
    
    const sock = makeWASocket({
        auth: { state, saveCreds: () => {} },
        printQRInTerminal: false
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        
        if (qr) {
            console.log('--- QR CODE ---');
            console.log('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(qr));
        }

        if (connection === 'close') {
            setTimeout(startBot, 5000); // ניסיון חיבור מחדש אחרי 5 שניות
        } else if (connection === 'open') {
            console.log('הבוט מחובר ופעיל!');
        }
    });
}

// שומר על הבוט בחיים
setInterval(() => {}, 1000);
startBot();
