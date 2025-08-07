const TOKEN = '1326171946:AAH1e1zDd_2woZ7w6rBGsrh8OsP5zqZOniY';
const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

const options = {
  polling: true
};

const bot = new TelegramBot(TOKEN, options);

let imageId = null;

bot.on('message', (msg) => {
  if (msg.photo) {
    // Use highest resolution photo (last element in photo array)
    imageId = msg.photo[msg.photo.length - 1].file_id;
    
    const opts = {
      parse_mode: "Markdown",
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [[{
          text: "SEND LOCATION",
          request_location: true
        }]]
      }
    };
    
    bot.sendMessage(msg.chat.id, 'Please let us know about your location too.', opts);

  } else if (msg.location) {
    bot.sendMessage(msg.chat.id, 'Thank you for reporting.');
    
    bot.getFileLink(imageId).then(imageLink => {
      const data = {
        imageLink,
        location: msg.location
      };
      
      request('http://localhost:9000/accident?info=' + encodeURIComponent(JSON.stringify(data)), (err, res, body) => {
        if (err) {
          console.error('Request error:', err);
        } else {
          console.log('Response body:', body);
        }
      });
    }).catch(err => {
      console.error('Error getting file link:', err);
    });

  } else {
    // For any other message (like text), ask for photo again
    bot.sendMessage(msg.chat.id, 'Please send a picture on the accident.');
  }
});

// Handle callback queries (optional)
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  let text;

  if (action === 'edit') {
    text = 'Edited Text';
    bot.editMessageText(text, opts);
  }
});
