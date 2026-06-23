const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('baileys');

async function startBot() {
    // יוצרים תיקייה בשם auth_session בתוך השרת
    const { state, saveCreds } = await useMultiFileAuthState('./auth_session');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // ביטלנו את זה כי זה עושה בעיות
        browser: ['MyBot', 'Chrome', '10.0']
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        // כאן הקסם: אם יש QR, נדפיס אותו כלינק ללוגים
        if (qr) {
            console.log('--- יש QR! תסרוק אותו: ---');
            console.log('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(qr));
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('חיבור נסגר. סיבה:', lastDisconnect?.error?.output?.payload?.message);
            if (shouldReconnect) {
                console.log('מנסה להתחבר מחדש...');
                startBot();
            }
        } else if (connection === 'open') {
            console.log('--- הבוט מחובר ופעיל! ---');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

startBot();
