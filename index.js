const { default: makeWASocket, DisconnectReason } = require('baileys');
const mongoose = require('mongoose');

// חיבור למסד הנתונים
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

async function startBot() {
    // הגדרה בזיכרון בלבד (מונע קריסות של הרשאות ב-Railway)
    const state = { creds: { noiseKey: null, registryId: 0, advSecretKey: null, pairingMode: false }, keys: { get: () => null, set: () => {} } };
    
    const sock = makeWASocket({
        auth: { state, saveCreds: () => {} },
        printQRInTerminal: false,
        browser: ['MyBot', 'Chrome', '10.0.0']
    });

    // בקשת קוד חיבור (Pairing Code)
    setTimeout(async () => {
        if (!sock.authState.creds.registered) {
            const phoneNumber = '972526241127'; // שנה למספר שלך!
            const code = await sock.requestPairingCode(phoneNumber);
            console.log('--- קוד חיבור לווטסאפ ---');
            console.log('הקוד שלך הוא: ' + code);
        }
    }, 5000);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('מתחבר מחדש...');
                startBot();
            }
        } else if (connection === 'open') {
            console.log('הבוט מחובר ופעיל!');
        }
    });

    // טיפול בהודעות נכנסות
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        
        console.log('התקבלה הודעה!');
        await sock.sendMessage(msg.key.remoteJid, { text: 'הבוט פעיל ועובד!' });
    });
}

// לולאה שמונעת מהתהליך להיסגר
setInterval(() => {}, 1000);

startBot();
