'use strict';

var path = require('path');
var base = path.join(__dirname, '../..');

module.status = require(path.join(base, 'bin/utils/status.js'));

function getRate(cmd, arg, message) {
  module.status.addRequest('rate');
  var response = '<b>R A T E</b>\n\n';
  response += 'If this bot is helpful to you, consider a good rating at @Storebot.';
  return {
    text: response,
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Rate this bot!',
          url: 'https://telegram.me/storebot?start=TreasureCruiseBot'
        }]
      ]
    },
    chat_id: message.chat.id
  };
}

exports.getReply = function(cmd, arg, message) {
  switch (cmd) {
    case 'rate':
      return getRate(cmd, arg, message);
  }
};

exports.commands = ['rate'];
