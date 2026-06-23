sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        
        if (qr) {
            // במקום לנסות לצייר QR בטרמינל, נדפיס לינק שאפשר לפתוח בדפדפן
            console.log('סרוק את ה-QR הזה מהדפדפן: https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(qr));
        }

        if (connection === 'close') {
            startBot();
        } else if (connection === 'open') {
            console.log('Bot is online!');
        }
    });
