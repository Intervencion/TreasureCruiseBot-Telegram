'use strict';

var path = require('path');
var base = path.join(__dirname, '../..');
var name = path.basename(base);
var token = require(path.join(global.base, 'token', name + '.json')).token;
var telegram = require(path.join(global.base, 'telegram.js'));

var settings = ['command'];

function set(cmd, arg, message) {
  var args = arg.split(' ');
  if (args.length > 1) {
    telegram.send('getChatAdministrators', {
      form: {
        chat_id: message.chat.id
      }
    }, token).then(function(administrators) {
      administrators.some(function(administrator) {
        if (message.from.id === administrator.user.id) {
          settings.some(function(setting) {
            if (setting === args[0] && (args[1] === 'on' || args[1] === 'off')) {
              if (!global.userprefs.hasOwnProperty(message.chat.id)) {
                global.userprefs[message.chat.id] = {};
              }
              global.userprefs[message.chat.id][setting] = args[1];
              telegram.send('sendMessage', {
                form: {
                  text: '<b>S T A T U S</b>\n\n<b>' + setting + '</b> is now <b>' + args[1] + '</b>.',
                  chat_id: message.chat.id
                }
              }, token);
              return;
            }
          });
          return;
        }
      });
    });
  }
}

exports.getReply = function(cmd, arg, message) {
  switch (cmd) {
    case 'set':
      return set(cmd, arg, message);
  }
};

exports.commands = ['set'];
