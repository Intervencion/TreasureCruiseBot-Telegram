'use strict';

function getDrops(cmd, arg, message) {
  return {
    text: '<b>D R O P S</b>\n\nClick <a href="http://optc-db.github.io/drops/">here</a> to see drops and bonuses on all islands.',
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Open browser',
          url: 'http://optc-db.github.io/drops/'
        }]
      ]
    },
    chat_id: message.chat.id
  };
}

function getBonus(cmd, arg, message) {
  return {
    text: '<b>B O N U S</b>\n\nClick <a href="http://optc-db.github.io/drops/">here</a> to see drops and bonuses on all islands.',
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Open browser',
          url: 'http://optc-db.github.io/drops/'
        }]
      ]
    },
    chat_id: message.chat.id
  };
}

exports.getReply = function(cmd, arg, message) {
  switch (cmd) {
    case 'drops':
      return getDrops(cmd, arg, message);
    case 'bonus':
      return getBonus(cmd, arg, message);
  }
};

exports.commands = ['drops', 'bonus'];
