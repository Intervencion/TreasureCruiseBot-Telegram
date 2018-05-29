'use strict';

var path = require('path');
var base = path.join(__dirname, '../..');

module.status = require(path.join(base, 'bin/utils/status.js'));

function getRate(cmd, arg, message) {
  module.status.addRequest('rate');
  var response = '<b>Let\'s calculate how much do you hit.</b>\n\n';
  return {
    text: response,
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'boton',
          url: 'https://telegram.me/storebot?start=TreasureCruiseBot'
        }]
      ]
    },
    chat_id: message.chat.id
  };
}

exports.getReply = function(cmd, arg, message) {
  switch (cmd) {
    case 'damage':
      return getRate(cmd, arg, message);
  }
};

exports.commands = ['damage'];
