'use strict';

var startTime = new Date().getTime(),
  requests = {},
  users = 0,
  userDB = {};

function getStatus(cmd, arg, message) {
  var upTime = new Date().getTime() - startTime;
  upTime = upTime / 1000;
  var seconds = upTime % 60;
  upTime /= 60;
  var minutes = upTime % 60;
  upTime /= 60;
  var hours = upTime % 24;
  upTime /= 24;
  var days = upTime;
  var runTime = Math.floor(days) + 'd ' + Math.floor(hours) + 'h ' + Math.floor(minutes) + 'm ' + Math.floor(seconds) + 's ';
  var response = '<b>S T A T U S</b>\n\n<code>  uptime: </code>' + runTime + '\n<code>   users: </code>' + users + '\n\n';
  response += (requests.private) ? '<code> private: </code>' + requests.private + '\n' : '';
  response += (requests.group || requests.supergroup) ? '<code>   group: </code>' + (((requests.group) ? requests.group : 0) + ((requests.supergroup) ? requests.supergroup : 0)) + '\n' : '';
  response += (requests.callback) ? '<code>callback: </code>' + requests.callback + '\n' : '';
  response += (requests.inline) ? '\n<code>  inline: </code>' + requests.inline + '\n' : '';
  response += (requests.start) ? '\n<code>   start: </code>' + requests.start : '';
  response += (requests.help) ? '\n<code>    help: </code>' + requests.help : '';
  response += (requests.notice) ? '\n<code>  notice: </code>' + requests.notice : '';
  response += (requests.filter) ? '\n<code>  filter: </code>' + requests.filter : '';
  response += (requests.sort) ? '\n<code>    sort: </code>' + requests.sort : '';
  response += (requests.rate) ? '\n<code>    rate: </code>' + requests.rate : '';
  return {
    text: response,
    chat_id: message.chat.id
  };
}

function reset() {
  startTime = new Date().getTime();
  requests = {};
  users = 0;
  userDB = {};
  return getStatus();
}

exports.addRequest = function(type) {
  requests[type] = requests[type] + 1 || 1;
};

exports.addUser = function(id) {
  if (!userDB.hasOwnProperty(id)) {
    userDB[id] = Date.now();
    users += 1;
  }
};

exports.getReply = function(cmd, arg, message) {
  switch (cmd) {
    case 'status':
      return getStatus(cmd, arg, message);
    case 'reset':
      return reset();
  }
};

exports.commands = ['status', 'reset'];
