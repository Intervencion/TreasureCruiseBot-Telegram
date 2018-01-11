'use strict';

var path = require('path');
var https = require('https');
var fs = require('fs-extra');
var mime = require('mime');

global.base = __dirname;
global.admin = 1896312; // YOUR USER ID, YOU ARE ADMIN
global.host = 'intervencion.duckdns.org';
global.active = true;
global.userprefs = {};

var telegram = require(path.join(global.base, 'telegram.js'));

var bots = {};
var bots_enabled = ['gem'];

var data = {
  reload: path.join(global.base, 'data', 'reload.json'),
  requests: path.join(global.base, 'data', 'requests.json'),
  userprefs: path.join(global.base, 'data', 'userprefs.json')
};

bots_enabled.forEach(function(bot) {
  var name = bot;
  var module = require(path.join(global.base, 'bots', name, 'bin/app/app.js'));
  var token = module.token;
  bots[token] = {
    name: name,
    token: token,
    path: path.join(global.base, 'bots', name, 'bin/app/app.js'),
    module: module
  };
});

var messageTypes = ['text', 'audio', 'document', 'photo', 'sticker', 'video', 'voice', 'contact', 'location', 'new_chat_participant', 'left_chat_participant', 'new_chat_title', 'new_chat_photo', 'delete_chat_photo', 'group_chat_created'];

function saveAndQuit() {
  global.active = false;
  fs.outputJson(data.userprefs, global.userprefs, function() {
    process.exit(0);
  });
}

function serverFunctions(message, token) {
  if (message.from.id === global.admin && message.text) {
    switch (message.text.substring(1).toLowerCase()) {
      case 'kill':
        process.exit(0);
        return true;
      case 'reload':
        telegram.send('sendMessage', {
          form: {
            text: '<b>S T A T U S</b>\n\nReloading ...',
            chat_id: message.chat.id
          }
        }, token).then(function(message) {
          var reload = {
            message_id: message.message_id,
            chat_id: message.chat.id,
            token: token
          };
          fs.outputJson(data.reload, reload, function() {
            saveAndQuit();
          });
        });
        return true;
      case 'update':
        telegram.send('sendMessage', {
          form: {
            text: '<b>S T A T U S</b>\n\nUpdating ...',
            chat_id: message.chat.id
          }
        }, token).then(function(msg) {
          var bot = bots[token].name.split('-dev')[0];
          var bot_dev = bot + '-dev';
          fs.copy(path.join(global.base, 'bots', bot_dev), path.join(global.base, 'bots', bot), function(err) {
            if (err) {
              telegram.error(err, message, token);
            } else {
              telegram.send('editMessageText', {
                form: {
                  text: '<b>S T A T U S</b>\n\nDone!',
                  message_id: msg.message_id,
                  chat_id: msg.chat.id
                }
              }, token);
            }
          });
        });
        return true;
      default:
        return false;
    }
  }
  return false;
}

var webServer = https.createServer({
  key: fs.readFileSync(global.base + '/cert/private.key'),
  cert: fs.readFileSync(global.base + '/cert/public.pem')
}, function(req, res) {
  if (req.url.indexOf('/bot') === -1) {
    res.statusCode = 401;
    res.end();
  } else if (req.method === 'POST') {
    var fullBody = '';
    req.on('data', function(chunk) {
      fullBody += chunk.toString();
    });
    req.on('end', function() {
      try {
        var token = req.url.split('/bot')[1];
        var update = JSON.parse(fullBody);
        if (update.message) {
          if (!serverFunctions(update.message, token)) {
            messageTypes.forEach(function(type) {
              if (update.message[type]) {
                bots[token].module[type](update.message);
              }
            });
          }
        } else if (update.inline_query) {
          bots[token].module.inline_query(update.inline_query);
        } else if (update.chosen_inline_result) {
          bots[token].module.chosen_inline_result(update.chosen_inline_result);
        } else if (update.callback_query) {
          bots[token].module.callback_query(update.callback_query);
        }
      } catch (err) {
        // telegram.error(err, update, token);
      }
      if (global.active) {
        res.end('OK');
      }
    });
  } else {
    res.statusCode = 418;
    res.end();
  }
});

webServer.listen(8443, '0.0.0.0');

function setWebHook(url, cert, token) {
  var fileName = path.basename(cert);
  var formData = {};
  formData['certificate'] = {
    value: fs.createReadStream(cert),
    options: {
      filename: fileName,
      contentType: mime.lookup(fileName)
    }
  };

  return telegram.send('setWebHook', {
    qs: {
      url: url
    },
    formData: formData
  }, token).then(function(resp) {
    if (!resp) {
      throw new Error(resp);
    }
    return resp;
  });
}

for (var key in bots) {
  if (bots.hasOwnProperty(key)) {
    setWebHook(global.host + ':8443/bot' + bots[key].token, global.base + '/cert/public.pem', bots[key].token);
  }
}

fs.access(data.reload, fs.F_OK, function(err) {
  if (!err) {
    fs.readJson(data.reload, function(err, rldJson) {
      telegram.send('editMessageText', {
        form: {
          text: '<b>S T A T U S</b>\n\nDone!',
          message_id: rldJson.message_id,
          chat_id: rldJson.chat_id
        }
      }, rldJson.token).then(function() {
        fs.remove(data.reload);
      });
    });
  }
});

fs.access(data.userprefs, fs.F_OK, function(err) {
  if (!err) {
    fs.readJson(data.userprefs, function(err, usrprfJson) {
      global.userprefs = usrprfJson;
    });
  }
});

process.on('SIGINT', function() {
  saveAndQuit();
});

telegram.send('sendMessage', {
  form: {
    text: '<b>P I N G</b>',
    chat_id: global.admin
  }
}, '297167321:AAGE9ILG5dnCv05xzouFac4dA4DiRDPIO7c');
