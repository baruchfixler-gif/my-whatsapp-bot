const { default: makeWASocket, useMultiFileAuthState } = require('baileys');
const qrcode = require('qrcode-terminal');

async function startBot() {
    console.log('--- בוט עולה ---');
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
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'open') console.log('הבוט מחובר!');
    });
}

startBot();
