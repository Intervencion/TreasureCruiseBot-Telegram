'use strict';

var path = require('path');
var base = path.join(__dirname, '../..');

module.status = require(path.join(base, 'bin/utils/status.js'));

function getHelpText() {
  var response = '<b>Inline Mode:</b>\n\n';
  response += 'Use it in any chat.\n';
  response += '1. Type @TreasureCruiseBot followed by keywords\n';
  response += '2. Tap on a search result to get detailed information\n\n';
  response += '<b>Command Mode:</b>\n\n';
  response += 'Use it in groups.\n';
  response += '1. Send /search to search for a unit\n';
  response += '2. Send your keywords\n';
  response += '3. Tap on a search result to get detailed information\n\n';
  response += 'Talk to it directly.\n';
  response += '1. Send your keywords\n';
  response += '2. Tap on a search result to get detailed information\n\n';
  response += '<b>Additional commands:</b>\n';
  response += '/supergroup - join our crew\n';
  response += '/inline - inline mode explained\n';
  response += '/command - command mode explained\n';
  response += '/rate - rate this bot on @Storebot\n';
  response += '/notice - check the developer notice\n';
  response += '/random - get a random unit\n';
  response += '/bonus - a link to the bonus table\n';
  response += '/drops - a link to the drops page\n';
  response += '/github - a link to the Sourcecode\n';
  response += '/help - see this\n\n';
  response += '<b>Have fun!</b>\n';
  response += 'Developed by trashbytes\n';
  response += 'Maintained by @Intervencion\n\n';
/*  response += '<b>Note:</b> This bot is under heavy development so bugs may appear every now and then.\n\n';*/
  response += 'Database: 2016-12-18\n';
  return response;
}

function getStart(cmd, arg, message) {
  module.status.addRequest('start');
  var response = '<b>W E L C O M E</b>\n\n' + getHelpText();
  return {
    text: response,
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Get started!',
          switch_inline_query: ''
        }]
      ]
    },
    chat_id: message.chat.id
  };
}

function getHelp(cmd, arg, message) {
  module.status.addRequest('help');
  var response = '<b>H O W   T O   U S E</b>\n\n' + getHelpText();
  return {
    text: response,
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Get started!',
          switch_inline_query: ''
        }]
      ]
    },
    chat_id: message.chat.id
  };
}

function getInline(cmd, arg, message) {
  module.status.addRequest('help');
  var response = '<b>H O W   T O   U S E</b>\n\n';
  response += '<b>Inline Mode:</b>\n';
  response += 'The inline mode enables the bot to be used in <b>any</b> chat, group or channel – it doesn\'t matter whether the bot is a member or not.\n';
  response += '<i>(Hint: Keep in mind that inline mode doesn\'t allow embedded commands like direct linking to evolutions!)</i>\n\n';
  response += '<b>How to use:</b>\n';
  response += 'Type @TreasureCruiseBot in the message field, then type some keywords. The bot will offer you a list of results. Tap on an item to instantly send it to the chat.\n\n';
  response += '<b>Example:</b>\n';
  response += '@TreasureCruiseBot boa hancock';
  return {
    text: response,
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Let\'s try this!',
          switch_inline_query: 'boa hancock'
        }]
      ]
    },
    chat_id: message.chat.id
  };
}

function getCommand(cmd, arg, message) {
  var response = '<b>H O W   T O   U S E</b>\n\n';
  response += '<b>Command Mode:</b>\n';
  response += 'The command mode can be used when talking to the bot directly, or in a group, <b>if</b> the bot is a member and command mode is not disabled.\n\n';
  response += '<b>How to use:</b>\n';
  response += 'Send /search and then reply to the following prompt with some keywords. Tap on a result from the list to get the details.\n';
  response += '<i>(Hint: You can omit "/search" and go straight to sending your keywords when talking to the bot directly!)</i>\n\n';
  response += '<b>Example:</b>\n';
  response += '/search\n';
  response += '<i>wait for prompt...</i>\n';
  response += 'boa hancock\n\n';
  response += '<b>Shortcuts:</b>\n';
  response += '/boa_hancock\n';
  response += '/s boa hancock';
  return {
    text: response,
    chat_id: message.chat.id
  };
}

function getFilter(cmd, arg, message) {
  module.status.addRequest('filter');
  var response = '<b>H O W   T O   U S E</b>\n\n';
  response += '<b>Filtering:</b>\n';
  response += 'I have removed filtering for now. My implementation wasn\'t very good and pretty unstable. I am working on a new version with better filtering.';
  return {
    text: response,
    chat_id: message.chat.id
  };
}

function getNotice(cmd, arg, message) {
  module.status.addRequest('notice');
  var response = '<b>N O T I C E</b>\n\n';
  response += 'Hi everyone!\n\n';
  response += 'Former dev (Mr. Trashbytes) isn\'t working on the bot anymore.\n\n';
  response += 'Due that, the filtering stuff isn\'t a thing right now (since I -Intervención- don\'t know how to make it\).n\n';
  response += 'By the way, the DB is up to date.\n\n';
  response += '@Intervencion, September 18, 2016';
  return {
    text: response,
    disable_web_page_preview: true,
    chat_id: message.chat.id
  };
}

function getSupergroup(cmd, arg, message) {
  module.status.addRequest('supergroup');
  var response = '<b>S U P E R G R O U P</b>\n\n';
  response += 'Join our supergroup to travel the world of One Piece together!';
  return {
    text: response,
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Join now!',
          url: 'https://telegram.me/joinchat/ABzveEDxZTiNLYTRO5-kQg'
        }]
      ]
    },
    disable_web_page_preview: true,
    chat_id: message.chat.id
  };
}

function getSupergroup(cmd, arg, message) {
  module.status.addRequest('github');
  var response = '<b>S U P E R G R O U P</b>\n\n';
  response += 'Check how I have been made';
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
    case 'start':
      return getStart(cmd, arg, message);
    case 'help':
      return getHelp(cmd, arg, message);
    case 'inline':
      return getInline(cmd, arg, message);
    case 'command':
      return getCommand(cmd, arg, message);
    case 'filter':
      return getFilter(cmd, arg, message);
    case 'notice':
      return getNotice(cmd, arg, message);
    case 'supergroup':
      return getSupergroup(cmd, arg, message);
  }
};

exports.commands = ['help', 'start', 'inline', 'command', 'filter', 'notice', 'supergroup', 'github'];
