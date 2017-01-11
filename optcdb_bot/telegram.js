var URL = require('url');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var fs = require('fs-extra');
var fileType = require('file-type');
var mime = require('mime');
var path = require('path');
var stream = require('stream');
var qs = require('querystring');

var chat_ids = {};

function telegram(method, form, token) {
  form.url = URL.format({
    protocol: 'https',
    host: 'api.telegram.org',
    pathname: '/bot' + token + '/' + method
  });
  return request(form).then(function(resp) {
    if (resp.statusCode !== 200) {
      console.log({
        method: method,
        form: form,
        token: token
      });
      throw new Error(resp.statusCode + ' ' + resp.body);
    }
    var data;
    try {
      data = JSON.parse(resp.body);
    } catch (err) {
      throw new Error('Error parsing Telegram response: %s', resp.body);
    }
    if (data.ok) {
      return data.result;
    }
    throw new Error(data.error_code + ' ' + data.description);
  });
}

exports.send = function(method, form, token) {
  if (!token) {
    throw new Error('Telegram Bot Token not provided!');
  }
  if ((form.form && form.form.chat_id) || (form.qs && form.qs.chat_id)) {
    var chat_id;
    if (form.form) {
      chat_id = form.form.chat_id;
      form.form.parse_mode = 'HTML';
      if (form.form.reply_markup) {
        form.form.reply_markup = JSON.stringify(form.form.reply_markup);
      }
    } else {
      chat_id = form.qs.chat_id;
    }
    if (!chat_ids.hasOwnProperty(chat_id)) {
      chat_ids[chat_id] = Date.now();
    }
    var now = Date.now();
    if (now >= chat_ids[chat_id] + 1000) {
      chat_ids[chat_id] = now;
      return telegram(method, form, token);
    }
    var wait = 1000 - (now - chat_ids[chat_id]);
    chat_ids[chat_id] = now + wait;
    return Promise.delay(wait).then(function() {
      return telegram(method, form, token);
    });
  }
  if (form.form && form.form.results) {
    form.form.results = JSON.stringify(form.form.results);
  }
  return telegram(method, form, token);
};

exports.getFileLink = function(fileId, token) {
  return exports.send('getFile', {
    form: {
      file_id: fileId
    }
  }, token).then(function(resp) {
    return URL.format({
      protocol: 'https',
      host: 'api.telegram.org',
      pathname: '/file/bot' + token + '/' + resp.file_path
    });
  });
};

exports.downloadFile = function(fileId, downloadDir, token) {
  return exports.getFileLink(fileId, token).then(function(fileURI) {
    var fileName = fileURI.slice(fileURI.lastIndexOf('/') + 1);
    var filePath = downloadDir + '/' + fileName;
    return new Promise(function(resolve, reject) {
      request({
        uri: fileURI
      }).pipe(fs.createWriteStream(filePath)).on('error', reject).on('close', function() {
        resolve(filePath);
      });
    });
  });
};

exports.sendFile = function(type, filePath, form, token) {
  var formData;
  var fileName;
  var fileId;
  if (filePath instanceof stream.Stream) {
    fileName = URL.parse(path.basename(filePath.path)).pathname;
    formData = {};
    formData[type] = {
      value: filePath,
      options: {
        filename: qs.unescape(fileName),
        contentType: mime.lookup(fileName)
      }
    };
  } else if (Buffer.isBuffer(filePath)) {
    var filetype = fileType(filePath);
    if (!filetype) {
      throw new Error('Unsupported Buffer file type');
    }
    formData = {};
    formData[type] = {
      value: filePath,
      options: {
        filename: 'data.' + filetype.ext,
        contentType: filetype.mime
      }
    };
  } else if (fs.existsSync(filePath)) {
    fileName = path.basename(filePath);
    formData = {};
    formData[type] = {
      value: fs.createReadStream(filePath),
      options: {
        filename: fileName,
        contentType: mime.lookup(fileName)
      }
    };
  } else {
    fileId = filePath;
  }
  var opts = {
    qs: form
  };
  opts.formData = formData;
  opts.qs[type] = fileId;
  return new Promise(function(resolve, reject) {
    exports.send('send' + type.charAt(0).toUpperCase() + type.slice(1), opts, token).then(function(message) {
      if (message) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

exports.error = function(err, request, token) {
  err = err || 'undefined';
  if (request.chat) {
    if (request.chat.id !== global.admin) {
      exports.send('sendMessage', {
        form: {
          text: '<b>E R R O R</b>\n\nSomething went wrong. The developer has been notified.',
          chat_id: request.chat.id
        }
      }, token);
    }
  }
  exports.send('sendMessage', {
    form: {
      text: '<b>E R R O R</b>\n\n<b>' + (request.chat ? 'Message' : (request.query ? 'Inline Query' : 'Callback Query')) + ':</b>\n<pre>' + JSON.stringify(request, null, 2) + '</pre>\n\n<b>Error:</b>\n' + err.toString(),
      chat_id: global.admin
    }
  }, token);
};
