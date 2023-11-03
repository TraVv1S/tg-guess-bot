const telegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} =require('./options');
const sequelize = require('./db');
const User = require('./db/User');
const Demo = require('./db/Demo');

const token = process.env.TELEGRAM_TOKEN;
const bot = new telegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю число от 1 до 9`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}
 
const start = async () => {

    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (error) {
        console.log('Не удалось подключиться к БД', error);
    }

    bot.setMyCommands([
        {command: '/start', description: 'Начало'},
        {command: '/info', description: 'Инфо'},
        {command: '/game', description: 'Игра'}
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        console.log(msg);

        try {
            if (text === '/audio') {
                return bot.sendAudio(chatId, 'CQACAgIAAxkBAAPaZUOGGox2NO-1QLbXPgGYeMf3GZgAAss6AAKStNhJbfsrOxEax4ozBA');
            }
    
            if (msg.audio) {
                const demo = await Demo.findOne({ where: { link: msg.audio.file_id } });
                if (demo) {
                    console.log(demo);
                    return bot.sendMessage(chatId, 'Есть такая песня', demo);
                } else {
                    
                    return bot.sendMessage(chatId, 'Нет такой песни');
                }
                await Demo.create({
                    chatId
                    // chatId: chatId,
                    // author: msg.from.id,
                    // filename: msg.audio.file_name,
                    // type: msg.audio.mime_type,
                    // link: msg.audio.file_id,
                    // date: msg.audio.file_name,
                    // trackname: {type: DataTypes.STRING},
                    // messageId: msg.message_id,
                })
                return bot.sendMessage(chatId, `Трек: ${msg.audio.file_name}. Чят: ${chatId}. Ссыль: ${msg.audio.file_id}. Дата: ${new Date()}`);
            }
            if(text === '/start') {
                const user = await User.findOne({chatId});
                if (!user) {
                    await User.create({chatId});
                }
                
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/1.webp');
                return bot.sendMessage(chatId, user);
            }
        
            if (text === '/info') {
                const user = await User.findOne({chatId});
                return bot.sendMessage(chatId, `Тебя зовут ${user.id}`);
            }
    
            if (text === '/game') {
                return startGame(chatId);
            }
        
            if (msg.sticker) {
                return bot.sendSticker(chatId, msg.sticker.file_id );
            }
    
            return bot.sendMessage(chatId, 'Я не понял');

        } catch (error) {
            return bot.sendMessage("Ошибка: ", error.message)
        }
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