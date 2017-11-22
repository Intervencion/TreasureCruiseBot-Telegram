'use strict';

var path = require('path');
var qs = require('querystring');
var base = path.join(__dirname, '../..');
var name = path.basename(base);
var token = require(path.join(global.base,'token', name + '.json')).token;
var telegram = require(path.join(global.base, 'telegram.js'));
exports.token = token;
require(path.join(base, 'bin/utils/utils.js'));

var modules = {};
var modules_enabled = ['help', 'status', 'search', 'drops', 'rate', 'set', 'damage', 'github'];
var module_commands = [];

modules_enabled.forEach(function (module) {
  modules[module] = {
    name: module,
    path: path.join(base, 'bin/utils/' + module + '.js'),
    module: require(path.join(base, 'bin/utils/' + module + '.js'))
  };
  module_commands.push(modules[module].module.commands);
});

exports.text = function (message) {
  var userprefs = global.userprefs[message.chat.id] || {};
  try {
    modules.status.module.addUser(message.from.id);
    modules.status.module.addRequest(message.chat.type);
    var msg = message.text.toLowerCase();
    if (msg.indexOf('/') === 0) {
      msg = msg.substr(1);
      var cmd = msg.split(' ').shift().split('@')[0];
      var arg = msg.split(' ').slice(1).join(' ');
      if (!isNaN(parseFloat(cmd)) && isFinite(cmd)) {
        telegram.send('sendMessage', {
          form: modules.search.module.getUnitInfo(cmd, arg, message)
        }, token);
      } else {
        var answered = module_commands.some(function (commands) {
          return commands.some(function (command) {
            if (command.indexOf(cmd) > -1) {
              var response = modules[commands[0]].module.getReply(cmd, arg, message, userprefs);
              if (response) {
                telegram.send('sendMessage', {
                  form: response
                }, token);
                return true;
              }
            }
          });
        });
        if (!answered && cmd !== 'set') {
          telegram.send('sendMessage', {
            form: modules.search.module.getReply('search', msg, message, userprefs)
          }, token);
        }
      }
    } else {
      if (msg.indexOf('u n i t') !== 0 && msg.indexOf('s e a r c h') !== 0 && msg.indexOf('note:') !== 0) {
        telegram.send('sendMessage', {
          form: modules.search.module.getReply('search', msg, message, userprefs)
        }, token);
      }
    }
  } catch (err) {
    telegram.error(err, message, token);
  }
};

exports.inline_query = function (query) {
  try {
    modules.status.module.addUser(query.from.id);
    modules.status.module.addRequest('inline');
    var results = modules.search.module.i(query.query, parseInt(query.offset) || 0);
    telegram.send('answerInlineQuery', {
      form: {
        results: results,
        cache_time: 0,
        next_offset: (parseInt(query.offset) || 0) + 10,
        inline_query_id: query.id
      }
    }, token);
  } catch (err) {
    telegram.error(err, query, token);
  }
};

exports.callback_query = function (query) {
  try {
    modules.status.module.addUser(query.from.id);
    modules.status.module.addRequest(query.message.chat.type);
    modules.status.module.addRequest('callback');
    var callback_data = qs.parse(query.data);
    if (callback_data[1]) {
      var response = modules[callback_data[1]].module[callback_data[2]](callback_data['a'], callback_data['b'], query.message);
      telegram.send('editMessageText', {
        form: {
          text: response.text,
          message_id: query.message.message_id,
          chat_id: query.message.chat.id,
          reply_markup: response.reply_markup
        }
      }, token);
    }
    telegram.send('answerCallbackQuery', {
      form: {
        callback_query_id: query.id
      }
    }, token);
  } catch (err) {
    telegram.error(err, query, token);
  }
};
