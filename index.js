const { default: makeWASocket, useMultiFileAuthState } = require('baileys');

async function startBot() {
    console.log('מנסה להתחבר לווטסאפ...');
    const { state, saveCreds } = await useMultiFileAuthState('./auth_session');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true 
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if (qr) console.log('QR CODE:', qr);
        if (connection === 'open') console.log('הבוט מחובר!');
    });
}

startBot();
