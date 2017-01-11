'use strict';

var path = require('path');
var base = path.join(__dirname, '../..');

module.status = require(path.join(base, 'bin/utils/status.js'));

function getGithub(cmd, arg, message) {
  module.status.addRequest('github');
  var response = '<b>G I T H U B</b>\n\n';
  response += 'Check how I have been made.';
  return {
    text: response,
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Github',
          url: 'https://github.com/Intervencion/TreasureCruiseBot-Telegram'
        }]
      ]
    },
    disable_web_page_preview: true,
    chat_id: message.chat.id
  };
}

exports.getReply = function(cmd, arg, message) {
  switch (cmd) {
    case 'github':
      return getGithub(cmd, arg, message);
  }
};

exports.commands = ['github'];
