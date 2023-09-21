const TelegramBot = require('node-telegram-bot-api');
import('node-fetch').then((fetch) => {
    }).catch((error) => {
    console.error('Помилка при завантаженні модулю node-fetch:', error);
});

// Підставте свій токен бота з BotFather
const botToken = '2106699725:AAE8KIdwxw1UVIA1N6Z64yXKB_nHtq2Y-Dk';

// Створення об'єкта бота
const bot = new TelegramBot(botToken, { polling: true });

// URL сервера BF2 для отримання даних
const bf2ServerUrl = 'https://api.bflist.io/bf2/v1/servers/37.230.210.130:16567'; // Замініть на URL вашого сервера BF2 JSON

// Зберігайте список гравців, які зараз на сервері
let currentPlayers = [];

// Отримання інформації з сервера BF2
async function getBF2ServerInfo() {
    try {
        const response = await fetch(bf2ServerUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Помилка при отриманні інформації з сервера BF2:', error);
        return null;
    }
}

// Регулярний запит інформації з сервера і сповіщення користувачів
async function checkBF2ServerAndNotify() {
    const serverInfo = await getBF2ServerInfo();
    if (serverInfo) {
        const { players } = serverInfo;

        // Перевіряйте нових гравців
        const newPlayers = serverInfo.players.filter((player) => !currentPlayers.includes(player.name));


        if (newPlayers.length > 0) {
            // Відправлення вітальних повідомлень для нових гравців
            const chatId = '-1001895076419'; // ID чату для сповіщень
            newPlayers.forEach((newPlayer) => {
                bot.sendMessage(chatId, `Вітаємо ${newPlayer.name} на сервері BF2!`);
            });

            // Оновлення списку поточних гравців
            currentPlayers = players.map((player) => player.name);
        }
    }
}

// Періодично перевіряйте сервер і надсилайте оновлення
setInterval(checkBF2ServerAndNotify, 6000); // Кожну хвилину (60000 мс)

// Обробник команди /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        'Привіт! Я бот, який моніторить сервер BF2. Я буду надсилати вам оновлення щодо гравців на сервері.'
    );
});