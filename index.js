const { default: makeWASocket, useMultiFileAuthState } = require('baileys');
const mongoose = require('mongoose');

// חיבור למונגו
mongoose.connect(process.env.MONGO_URI).catch(err => console.log(err));

async function startBot() {
    // שימוש בתיקייה זמנית לזיכרון
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true // ננסה להדפיס QR רגיל שוב
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if (qr) {
            console.log('--- מצאתי QR! ---');
            console.log(qr); // בגרסאות מסוימות זה מדפיס את הקוד, בגרסאות אחרות צריך לסרוק מהמסך
        }
        if (connection === 'open') {
            console.log('הבוט מחובר!');
        }
    });
}

startBot();
