const fetch = require('node-fetch');
const readline = require('readline-sync');

const TOKEN = '7829941863:AAGm139bBNGSTEWd-wjVLvg8bksj_ucnuK4';
const CHAT_ID = '6235995291'; // Bisa didapat dari https://api.telegram.org/bot<TOKEN>/getUpdates
const API_URL = `https://api.telegram.org/bot${TOKEN}`;

async function sendMessage(text) {
    const url = `${API_URL}/sendMessage`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    return response.json();
}

async function getUpdates(offset) {
    const url = `${API_URL}/getUpdates?offset=${offset}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.result || [];
}

async function runBot() {
    let lastUpdateId = 0;
    console.log("Bot berjalan...");

    while (true) {
        const updates = await getUpdates(lastUpdateId + 1);
        for (const update of updates) {
            lastUpdateId = update.update_id;
            if (!update.message || !update.message.text) continue;

            const text = update.message.text;
            console.log(`Perintah diterima: ${text}`);

            if (text.startsWith('/run ')) {
                const command = text.replace('/run ', '');
                try {
                    const execSync = require('child_process').execSync;
                    const output = execSync(command, { encoding: 'utf8' });
                    await sendMessage(`Output:\n${output}`);
                } catch (error) {
                    await sendMessage(`Error: ${error.message}`);
                }
            }
        }
    }
}

runBot();
