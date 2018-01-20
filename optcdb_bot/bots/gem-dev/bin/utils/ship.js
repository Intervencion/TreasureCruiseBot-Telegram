'use strict';

var path = require('path');
var qs = require('querystring');
var base = path.join(__dirname, '../..');

var databaseShip = require(path.join(base, 'bin/data/databaseShip.js'));

function getShipResults(query) {
  var term = (!isNaN(parseFloat(query)) && isFinite(query)) ? ' ' + query + ' ' : ' ' + query;
  var results = [];
  databaseShip.getShipsDB().forEach(function(ship, index) {
    var id = index;
    if (ship) {
      var ship_name = ship.name;
      ship_name = ' ' + id + ' ' + ship_name.toLowerCase().replace(/\'/g, '').replace(/[^a-z0-9]/g, ' ').replace(/ +(?= )/g, '');
      ship_name = ' *' + ship_name.toLowerCase();
      term = term.replace(/_/g, ' ');
      if (ship_name.indexOf(term) > -1) {
        results.push(id);
      }
    }
  });
  return results;
}

function getInlineShipResults(query, offset) {
  var results = getShipResults(query.trim());
  var response = [{
    type: 'article',
    id: 'notfound',
    title: 'S H I P',
    parse_mode: 'HTML',
    description: 'No results for ' + query.substr(0, 5) + '... Try something different.',
    message_text: '<b>S H I P</b>\n\nNo results for <b>' + query.substr(0, 5) + '..</b>. Try something different.',
    thumb_url: 'http://onepiece-treasurecruise.com/wp-content/themes/onepiece-treasurecruise/images/noimage.png'
  }];
  if (typeof results[0] !== "undefined") {
    response = [];
    for (var i = offset; i < offset + 10; i++) {
      if (typeof results[i] !== "undefined") {
        var ship = databaseShip.getShip(results[i]);
        response.push({
          type: 'article',
          id: String(results[i]),
          title: ship.name,
          parse_mode: 'HTML',
          description: ship.description,
          message_text: databaseShip.getShipInfo(results[i], "inline"),
          thumb_url: (databaseShip.getShip(results[i])) ? 'https://onepiece-treasurecruise.com/wp-content/uploads/' + ship.thumb : 'http://onepiece-treasurecruise.com/wp-content/themes/onepiece-treasurecruise/images/noimage.png'
        });
      }
    }
    return response;
  }
  if (offset === 0) {
    return response;
  }
}

function getCommandShipResults(query, offset, message, userprefs) {
  if (userprefs && (userprefs.command && userprefs.command === 'off')) {
    response = '<b>E R R O R</b>\n\n';
    response += '/command mode has been disabled in this group by an administrator to prevent spamming.\n\nIf you just want to get some information, please talk to the bot directly and if you want to share a unit use the /inline mode!\n\nLet\'s keep the chat clean.';
    return {
      text: response,
      chat_id: message.chat.id,
      reply_markup: {
        inline_keyboard: [
          [{
            text: 'Alright, will do!',
            switch_inline_query: ''
          }]
        ]
      }
    };
  }
  query = query.toLowerCase().replace(/\'/g, '').replace(/[^a-z0-9*]/g, '_').replace(/_+(?=_)/g, '');
  if (query) {
    var results = getShipResults(query);
    if (results.length > 1) {
      offset = parseInt(offset) || 0;
      var next_offset = offset + 10;
      var prev_offset = offset - 10;
      if (next_offset >= results.length) {
        next_offset = offset;
      }
      if (prev_offset < 0) {
        prev_offset = 0;
      }
      var response = '<b>S H I P</b>\n\n' + results.length + ' results:\n\n';
      if (typeof results[0] !== "undefined") {
        for (var i = offset; i < offset + 10; i++) {
          if (typeof results[i] !== "undefined") {
          	response += '/ship ' + results[i] + '\n' + databaseShip.getShip(results[i]).name.toUpperCase() + '\n\n';
          }
        }
        return {
          text: response,
          reply_markup: {
            inline_keyboard: [
              [{
                text: offset > 0 ? '<<' : '\u2007',
                callback_data: qs.stringify({
                  1: offset > 0 ? 'ship' : '',
                  2: 'sh',
                  a: query,
                  b: 0,
                  x: String(Math.random() * 10).substr(0, 1)
                })
              }, {
                text: offset > 0 ? '<' : '\u2007',
                callback_data: qs.stringify({
                  1: offset > 0 ? 'ship' : '',
                  2: 'sh',
                  a: query,
                  b: prev_offset,
                  x: String(Math.random() * 10).substr(0, 1)
                })
              }, {
                text: (offset / 10 + 1) + '/ship' + Math.ceil(results.length / 10),
                callback_data: qs.stringify({
                  x: String(Math.random() * 10).substr(0, 1)
                })
              }, {
                text: offset < results.length - 10 ? '>' : '\u2007',
                callback_data: qs.stringify({
                  1: offset < results.length - 10 ? 'getInlineShipResults' : '',
                  2: 'sh',
                  a: query,
                  b: next_offset,
                  x: String(Math.random() * 10).substr(0, 1)
                })
              }, {
                text: offset < results.length - 10 ? '>>' : '\u2007',
                callback_data: qs.stringify({
                  1: offset < results.length - 10 ? 'ship' : '',
                  2: 'sh',
                  a: query,
                  b: (Math.ceil(results.length / 10) * 10 - 10),
                  x: String(Math.random() * 10).substr(0, 1)
                })
              }]
            ]
          },
          chat_id: message.chat.id
        };
      }
    }
    if (results.length > 0) {
      return {
      	text: databaseShip.getShipInfo(results[0], null, message),
        chat_id: message.chat.id
      };
    }
    return {
      text: '<b>S H I P</b>\n\nNo results for <b>' + query.substr(0, 5) + '..</b>. Try something different.',
      chat_id: message.chat.id
    };
  }
  return {
    text: '<b>S H I P</b>\n\nPlease send me the name you want to search for. i.e. /ship Moby',
    reply_markup: {
      force_reply: message.chat.type.indexOf('group') > -1,
      selective: message.chat.type.indexOf('group') > -1
    },
    reply_to_message_id: message.chat.type.indexOf('group') > -1 && message.message_id,
    chat_id: message.chat.id
  };
}


exports.getShipInfo = function(id, arg, message) {
  if (databaseShip.getShip(id)) {
    return {
      text: databaseShip.getShipInfo(parseInt(id), message.chat.type),
      chat_id: message.chat.id
    };
  }
  return {
    text: '<b>S H I P</b>\n\nShip not found.',
    chat_id: message.chat.id
  };
};


exports.getReply = function(cmd, arg, message, userprefs) {
  switch (cmd) {
    case 'ship':
      return getCommandShipResults(arg, 0, message, userprefs);
  }
};

exports.commands = ['ship'];

exports.sh = getInlineShipResults;