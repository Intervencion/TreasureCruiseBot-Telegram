'use strict';

var path = require('path');
var qs = require('querystring');
var base = path.join(__dirname, '../..');

module.status = require(path.join(base, 'bin/utils/status.js'));
var database = require(path.join(base, 'bin/data/database.js'));


function getSearchResults(query) {
  var term = (!isNaN(parseFloat(query)) && isFinite(query)) ? ' ' + query + ' ' : ' ' + query;
  var results = [];
  database.getUnitsDB().forEach(function(unit, index) {
    var id = index + 1;
    if (unit[0]) {
      var unit_name = (unit[0]).toString();
      if (database.getAliasesDB()[id]) {
        unit_name += ' ' + database.getAliasesDB()[id].join(' ').toLowerCase();
      }
      unit_name = ' ' + id + ' ' + unit_name.toLowerCase().replace(/\'/g, '').replace(/[^a-z0-9]/g, ' ').replace(/ +(?= )/g, '');
      unit_name = ' *' + unit_name.toLowerCase();
      term = term.replace(/_/g, ' ');
      if (unit_name.indexOf(term) > -1) {
        results.push(id);
      }
    }
  });
  return results;
}

function getInlineSearchResults(query, offset) {
  var results = getSearchResults(query.toLowerCase());
  var response = [{
    type: 'article',
    id: 'notfound',
    title: 'S E A R C H',
    parse_mode: 'HTML',
    description: 'No results for ' + query.toLowerCase().substr(0, 5) + '... Try something different.',
    message_text: '<b>S E A R C H</b>\n\nNo results for <b>' + query.toLowerCase().substr(0, 5) + '..</b>. Try something different.',
    thumb_url: 'http://onepiece-treasurecruise.com/wp-content/themes/onepiece-treasurecruise/images/noimage.png'
  }];

  if (results[0]) {
    response = [];
    for (var i = offset; i < offset + 10; i++) {
      if (results[i]) {
		  var desc;
		  var ratingp = database.getUnit(results[i])[3];
		  var rating = ratingp.split("");
		  var r1 = rating[0];
		  var r2 = rating[1];
		  if "+" in r2{
			  if(ratingp == 6){
			   desc = '\🌟\🌟\🌟\🌟\🌟\🌟'+ '\u2795'; // Thanks @duhow
			   //desc = '\☃\☃\☃\☃\☃\☃'; // Thanks @duhow
			   } else {
			  desc =  '\u2B50\u2B50\u2B50\u2B50\u2B50'.substr(0, ratingp)+ '\u2795';
			  //desc =  '\u2744\u2744\u2744\u2744\u2744'.substr(0, rating);
			  }
		  }
		  else{
		   if(ratingp == 6){
			   desc = '\🌟\🌟\🌟\🌟\🌟\🌟'; // Thanks @duhow
			   //desc = '\☃\☃\☃\☃\☃\☃'; // Thanks @duhow
			   } else {
			  desc =  '\u2B50\u2B50\u2B50\u2B50\u2B50'.substr(0, ratingp);
			  //desc =  '\u2744\u2744\u2744\u2744\u2744'.substr(0, rating);
			  }
		  }
        response.push({
          type: 'article',
          id: String(results[i]),
          title: database.getUnit(results[i])[0],
          parse_mode: 'HTML',
          description: desc,
          message_text: database.getUnitInfo(results[i], 'inline'),
          thumb_url: (database.getUnit(results[i]).indexOf(null) === -1) ? 'http://onepiece-treasurecruise.com/wp-content/uploads/f' + String('0000' + (results[i])).slice(-4).replace(/(057[54])/, '0$1') + '.png' : 'http://onepiece-treasurecruise.com/wp-content/themes/onepiece-treasurecruise/images/noimage.png'
        });
    }
      }
    return response;
  }

  if (offset === 0) {
    return response;
  }
}

function getCommandSearchResults(query, offset, message, userprefs) {
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
    var results = getSearchResults(query);
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
      var response = '<b>S E A R C H</b>\n\n' + results.length + ' results:\n\n';
      if (results[0]) {
        for (var i = offset; i < offset + 10; i++) {
          if (results[i]) {
            response += '/' + results[i] + '\n' + database.getUnit(results[i])[0] + '\n\n';
          }
        }
        return {
          text: response,
          reply_markup: {
            inline_keyboard: [
              [{
                text: offset > 0 ? '<<' : '\u2007',
                callback_data: qs.stringify({
                  1: offset > 0 ? 'search' : '',
                  2: 'c',
                  a: query,
                  b: 0,
                  x: String(Math.random() * 10).substr(0, 1)
                })
              }, {
                text: offset > 0 ? '<' : '\u2007',
                callback_data: qs.stringify({
                  1: offset > 0 ? 'search' : '',
                  2: 'c',
                  a: query,
                  b: prev_offset,
                  x: String(Math.random() * 10).substr(0, 1)
                })
              }, {
                text: (offset / 10 + 1) + '/' + Math.ceil(results.length / 10),
                callback_data: qs.stringify({
                  x: String(Math.random() * 10).substr(0, 1)
                })
              }, {
                text: offset < results.length - 10 ? '>' : '\u2007',
                callback_data: qs.stringify({
                  1: offset < results.length - 10 ? 'search' : '',
                  2: 'c',
                  a: query,
                  b: next_offset,
                  x: String(Math.random() * 10).substr(0, 1)
                })
              }, {
                text: offset < results.length - 10 ? '>>' : '\u2007',
                callback_data: qs.stringify({
                  1: offset < results.length - 10 ? 'search' : '',
                  2: 'c',
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
        text: database.getUnitInfo(results[0], null, message),
        chat_id: message.chat.id
      };
    }
    return {
      text: '<b>S E A R C H</b>\n\nNo results for <b>' + query.substr(0, 5) + '..</b>. Try something different.',
      chat_id: message.chat.id
    };
  }
  return {
    text: '<b>S E A R C H</b>\n\nPlease send me the name you want to search for',
    reply_markup: {
      force_reply: message.chat.type.indexOf('group') > -1,
      selective: message.chat.type.indexOf('group') > -1
    },
    reply_to_message_id: message.chat.type.indexOf('group') > -1 && message.message_id,
    chat_id: message.chat.id
  };
}

function getRandom(cmd, arg, message) {
  return {
    text: database.getUnitInfo(Math.floor(Math.random() * (database.getUnitsDB().length))),
    chat_id: message.chat.id
  };
}

exports.getUnitInfo = function(id, arg, message) {
  if (database.getUnit(id) && database.getUnit(id)[0]) {
    return {
      text: database.getUnitInfo(parseInt(id), message.chat.type),
      chat_id: message.chat.id
    };
  }
  return {
    text: '<b>S E A R C H</b>\n\nUnit not found.',
    chat_id: message.chat.id
  };
};

exports.getReply = function(cmd, arg, message, userprefs) {
  switch (cmd) {
    case 'search':
    case 's':
      return getCommandSearchResults(arg, 0, message, userprefs);
    case 'random':
      return getRandom(cmd, arg, message);
  }
};

exports.commands = ['search', 's', 'random', 'debug'];

exports.c = getCommandSearchResults;
exports.i = getInlineSearchResults;