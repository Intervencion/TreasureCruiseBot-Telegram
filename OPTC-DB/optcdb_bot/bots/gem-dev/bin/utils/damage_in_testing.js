'use strict';
var qs = require('querystring');

function getdamage(cmd, arg, message) {
  return {
    text: String(Math.random() * 10).substr(0, 1),
    reply_markup: {
      inline_keyboard: [
        [{
          text: '1',
          callback_data: qs.stringify({
            1: 'damage', //module
            2: 'a', //function name (see bottom of file: exports.a)
            a: 'cmd', //what will be given to function as cmd, can be anything
            b: 'arg', //what will be given to function as arg, can be anything
            x: String(Math.random() * 10).substr(0, 1) //random number, leave as is to prevent errors when markup isnt changed
          })
        }, {
          text: '2',
          callback_data: qs.stringify({
            1: 'damage', //module
            2: 'a', //function name (see bottom of file: exports.a)
            a: 'cmd', //what will be given to function as cmd, can be anything
            b: 'arg', //what will be given to function as arg, can be anything
            x: String(Math.random() * 10).substr(0, 1) //random number, leave as is to prevent errors when markup isnt changed
          })
        }],
        [{
          text: '3',
          callback_data: qs.stringify({
            1: 'damage', //module
            2: 'a', //function name (see bottom of file: exports.a)
            a: 'cmd', //what will be given to function as cmd, can be anything
            b: 'arg', //what will be given to function as arg, can be anything
            x: String(Math.random() * 10).substr(0, 1) //random number, leave as is to prevent errors when markup isnt changed
          })
        }, {
          text: '4',
          callback_data: qs.stringify({
            1: 'damage', //module
            2: 'a', //function name (see bottom of file: exports.a)
            a: 'cmd', //what will be given to function as cmd, can be anything
            b: 'arg', //what will be given to function as arg, can be anything
            x: String(Math.random() * 10).substr(0, 1) //random number, leave as is to prevent errors when markup isnt changed
          })
        }]
      ]
    },
    chat_id: message.chat.id
  };
}

exports.getReply = function (cmd, arg, message) {
  switch (cmd) {
    case 'damage':
      return getdamage(cmd, arg, message);
  }
};

exports.commands = ['damage'];

exports.a = getdamage;