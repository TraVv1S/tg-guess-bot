const telegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} =require('./options');

const token = '6982564695:AAGE9LhEGqWez-4ftqMP7sL78-4x323s5Zg';

const bot = new telegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю число от 1 до 9`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}
 

bot.setMyCommands([
    {command: '/start', description: 'Начало'},
    {command: '/info', description: 'Инфо'},
    {command: '/game', description: 'Игра'}
])




const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/1.webp');
            return bot.sendMessage(chatId, 'Добро пожаловать в bot`a dsprg_test');
        }
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }

        if (text === '/game') {
            return startGame(chatId);
        }
    
        if (msg.sticker) {
            return bot.sendSticker(chatId, msg.sticker.file_id );
        }
        //console.log(msg);
        

        return bot.sendMessage(chatId, 'Я не понял');
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            startGame(chatId);
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты тогадал цифру ${data}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `/game Попробуй ещё раз. Цифра была ${chats[chatId]}`, againOptions);
        } 
        
    })
}

start();