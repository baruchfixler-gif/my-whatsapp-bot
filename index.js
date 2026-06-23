const { default: makeWASocket, useMultiFileAuthState } = require('baileys');

async function startBot() {
    console.log('מנסה להתחבר לווטסאפ...');
    const { state, saveCreds } = await useMultiFileAuthState('./auth_session');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true 
    });

   sock.ev.on('connection.update', (update) => {
    const { connection, qr, lastDisconnect } = update;

    // הטיפול ב-QR החדש
    if (qr) {
        console.log('--- QR CODE הגיע! ---');
        console.log('תעתיק את הקוד הזה לאתר QR Generator או תשתמש ב-Pairing Code:');
        console.log(qr); 
    }

    if (connection === 'close') {
        console.log('החיבור נסגר, מנסה שוב...');
    } else if (connection === 'open') {
        console.log('הבוט מחובר ופעיל!');
    }
});
}

startBot();
