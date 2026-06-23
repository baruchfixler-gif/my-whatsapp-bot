const { default: makeWASocket, useMultiFileAuthState } = require('baileys');

async function startBot() {
    console.log('מתחיל חיבור לווטסאפ...');
    
    // ניצור תיקיית אימות מקומית
    const { state, saveCreds } = await useMultiFileAuthState('./auth_session');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false // ביטלנו את זה כי זה עושה באגים ב-Railway
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        
        // כאן הקסם: אם יש QR, הוא יודפס כלינק בלוגים
        if (qr) {
            console.log('--- יש QR! תעתיק את הלינק הבא לדפדפן כדי לסרוק ---');
            console.log('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(qr));
        }

        if (connection === 'open') {
            console.log('הבוט מחובר ופעיל!');
        }
    });
}

startBot();
