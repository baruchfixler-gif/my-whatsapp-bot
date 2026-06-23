const { default: makeWASocket } = require('baileys');
const mongoose = require('mongoose');

// חיבור למונגו עם timeout קצר יותר
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error'));

async function startBot() {
    const sock = makeWASocket({
        auth: { state: { creds: { noiseKey: null, registryId: 0, advSecretKey: null, pairingMode: false }, keys: { get: () => null, set: () => {} } }, saveCreds: () => {} },
        printQRInTerminal: false,
        browser: ['MyBot', 'Chrome', '1.0.0']
    });

    // מחכים 7 שניות ואז מבקשים את קוד החיבור
    setTimeout(async () => {
        try {
            const code = await sock.requestPairingCode('972526241127'); // שנה למספר שלך!
            console.log('הקוד שלך לחיבור: ' + code);
        } catch (err) {
            console.log('שגיאה ביצירת קוד, מנסה שוב...');
        }
    }, 7000);

    sock.ev.on('connection.update', (update) => {
        if (update.connection === 'open') console.log('הבוט מחובר!');
    });
}

startBot();
