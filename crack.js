const fetch = require('node-fetch');  // Import node-fetch untuk request ke Telegram API

// Ganti dengan token bot Telegrammu
const BOT_TOKEN = '7829941863:AAGm139bBNGSTEWd-wjVLvg8bksj_ucnuK4';
// Ganti dengan chat ID kamu
const CHAT_ID = '6235995291';

// URL Telegram API
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/`;

// Fungsi untuk mengirim pesan ke Telegram
const sendMessage = async (message) => {
  await fetch(`${API_URL}sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
    }),
  });
};

// Fungsi untuk mendapatkan pesan terbaru dari bot
const getUpdates = async (offset) => {
  const response = await fetch(`${API_URL}getUpdates?offset=${offset}`);
  const data = await response.json();
  return data.result;
};

// Fungsi untuk menjalankan perintah di Termux dan mengirimkan hasilnya ke Telegram
const runCommand = async (command) => {
  const { exec } = require('child_process');
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      sendMessage(`Error executing command: ${error.message}`);
      return;
    }
    if (stderr) {
      sendMessage(`stderr: ${stderr}`);
      return;
    }
    sendMessage(`Hasil perintah:\n${stdout}`);
  });
};

// Fungsi utama untuk menjalankan loop pengecekan pesan
const main = async () => {
  let offset = 0; // Offset untuk melanjutkan dari update sebelumnya
  console.log('Bot sedang berjalan...');

  while (true) {
    const updates = await getUpdates(offset);

    // Proses setiap pesan yang diterima
    for (const update of updates) {
      const message = update.message.text;

      if (message) {
        console.log(`Perintah diterima: ${message}`);
        await sendMessage(`Menjalankan perintah: ${message}`);
        await runCommand(message);
        offset = update.update_id + 1;  // Update offset agar tidak memproses pesan yang sama lagi
      }
    }

    // Tunggu 1 detik sebelum mengecek pesan lagi
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

// Jalankan bot
main();
