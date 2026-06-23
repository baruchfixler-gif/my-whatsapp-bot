const { default: makeWASocket, useMultiFileAuthState } = require('baileys');
const qrcode = require('qrcode-terminal'); // הוספנו את הספרייה הזו

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_session');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false 
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        
        if (qr) {
            console.log('--- QR CODE ---');
            qrcode.generate(qr, { small: true }); // פקודה שמדפיסה את ה-QR בצורה ויזואלית בטרמינל
        }
        
        if (connection === 'open') {
            console.log('הבוט מחובר ופעיל!');
        }
    });
}

startBot();
