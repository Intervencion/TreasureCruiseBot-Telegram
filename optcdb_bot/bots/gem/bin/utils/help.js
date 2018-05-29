'use strict';

var path = require('path');
var base = path.join(__dirname, '../..');

module.status = require(path.join(base, 'bin/utils/status.js'));
var fs = require('fs-extra');

var telegram = require(path.join(global.base, 'telegram.js'));
var serverjs = require(path.join(global.base, 'server.js'));
var token = require(path.join(global.base, 'token', 'gem.json'/*BOTNAME.json*/)).token;

var arrayFiles = ["units.js","details.js","ships.js","evolutions.js","drops.js","cooldowns.js", "aliases.js"];

var data = {
  reload: path.join(global.base, 'data', 'reload.json'),
  requests: path.join(global.base, 'data', 'requests.json'),
  userprefs: path.join(global.base, 'data', 'userprefs.json')
};
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
  response += 'Maintained by @Intervencion and @stereo89\n\n';
  /*  response += '<b>Note:</b> This bot is under heavy development so bugs may appear every now and then.\n\n';*/
  response += 'Database: 2018-5-15\n';
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

function getGithub(cmd, arg, message) {
  module.status.addRequest('github');
  var response = '<b>G I T H U B</b>\n\n';
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
//NEW CODE

function getDownloadUpdates(cmd, arg, message) {
  //console.log('downloadUpdates');
  if(message.from.id === global.admin && message.text){ 
    module.status.addRequest('download');

    // var username =  require('child_process').execSync( "whoami", { encoding: 'utf8', timeout: 1000 } );
    // console.log(String(username).trim());
    // var pathPWD =  require('child_process').execSync( "pwd", { encoding: 'utf8', timeout: 1000 } );
    // console.log(String(pathPWD).trim());

    // notes file???        
    //DOWNLOAD
    arrayFiles.forEach(function(item){
      var fileToDownload = item;
      downloadFile(fileToDownload, message);
    });   

    var response = '<b>D O W N L O A D</b>\n\n';
    response += 'Downloading files';
    return {
      text: response,
      disable_web_page_preview: true,
      chat_id: message.chat.id
    };
  }
}

function downloadFile(fileName, message){
  var https = require('https');
  var destName = fileName.slice(0, fileName.lastIndexOf(".js")) + "DB" + fileName.slice(fileName.lastIndexOf(".js"));
  var destPath = base + "/updates/"+destName
  var file = fs.createWriteStream(destPath);
  var request = https.get("https://raw.githubusercontent.com/optc-db/optc-db.github.io/master/common/data/"+fileName, function(responseHTTPS) {

    responseHTTPS.pipe(file);
    
    responseHTTPS.on("end", function() {
      //console.log("Downloaded "+fileName);
      var response = '<b>D O W N L O A D</b>\n\n';
      response += 'Downloaded file '+fileName;
      telegram.send('sendMessage', {
        form: {
          text: response,
          chat_id: message.chat.id
        }
      }, token);
    });

  });
  return true;
}

function getFixDBFiles(cmd, arg, message) {
  if(message.from.id === global.admin && message.text){ 
    module.status.addRequest('fixfiles');

    //REPLACING window.units with module.exports
    var numFiles = 0;
    arrayFiles.forEach(function(item){
      if(replaceString(item)){
        numFiles++;
      }
      else{
        console.err("Error: "+item +" not fixed.")
      }
    }); 

    var response = '<b>F I X  F I L E S</b>\n\n';
    response += '#'+numFiles+' files fixed';
    return {
      text: response,
      disable_web_page_preview: true,
      chat_id: message.chat.id
    };
  }
}

function replaceString(fileName){
  var fs = require('fs');
  var destName = fileName.slice(0, fileName.lastIndexOf(".js")) + "DB" + fileName.slice(fileName.lastIndexOf(".js"));
  var filePath = base + "/updates/"+destName
  fs.readFile(filePath, 'utf8', function (err,data) {
    if (err) {
      return console.error(err);
    }
    var result = data.replace("window."+(fileName.slice(0, fileName.lastIndexOf(".js"))) , "module.exports");
    fs.writeFile(filePath, result, 'utf8', function (err) {
     if (err) return console.error(err);
   });
  });

  return true;
}

function getBackupCurrentDB(cmd, arg, message){
  if(message.from.id === global.admin && message.text){ 
    module.status.addRequest('backup');
    //BACKUP OLD VERSION

    arrayFiles.forEach(function(item){
      var fileToCopy = item.slice(0, item.lastIndexOf(".js")) + "DB" + item.slice(item.lastIndexOf(".js"));
      fs.createReadStream(base + "/data/"+  fileToCopy).pipe(fs.createWriteStream(base + "/backup/"+  fileToCopy));
    }); 

    var response = '<b>B A C K U P</b>\n\n';
    response += 'Current version of DB backuped.';
    return {
      text: response,
      disable_web_page_preview: true,
      chat_id: message.chat.id
    };
  }
}

function getRestoreOldDB(cmd, arg, message){
  if(message.from.id === global.admin && message.text){ 
    module.status.addRequest('restore');
    //RESTORE OLD VERSION

    arrayFiles.forEach(function(item){
      var fileToCopy = item.slice(0, item.lastIndexOf(".js")) + "DB" + item.slice(item.lastIndexOf(".js"));
      fs.createReadStream(base + "/backup/"+  fileToCopy).pipe(fs.createWriteStream(base + "/data/"+  fileToCopy));
    });

    var response = '<b>R E S T O R E</b>\n\n';
    response += 'Previous version of DB restored. Reloading...';
      telegram.send('sendMessage', {
        form: {
          text: response,
          chat_id: message.chat.id
        }
      }, token);

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

    var response = '<b>D O N E</b>\n\n';
    return {
      text: response,
      disable_web_page_preview: true,
      chat_id: message.chat.id
    };
  }
}

function getUpdateDB(cmd, arg, message){
  if(message.from.id === global.admin && message.text){ 
    module.status.addRequest('updatedb');
    //RESTORE OLD VERSION

    arrayFiles.forEach(function(item){
      var fileToCopy = item.slice(0, item.lastIndexOf(".js")) + "DB" + item.slice(item.lastIndexOf(".js"));
      fs.createReadStream(base + "/updates/"+  fileToCopy).pipe(fs.createWriteStream(base + "/data/"+  fileToCopy));
    });

    var response = '<b>U P D A T E</b>\n\n';
    response += 'Version of DB Updated. Reloading...';
      telegram.send('sendMessage', {
        form: {
          text: response,
          chat_id: message.chat.id
        }
      }, token);

    updateVersion();

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

    var response = '<b>D O N E</b>\n\n';
    return {
      text: response,
      disable_web_page_preview: true,
      chat_id: message.chat.id
    };
  }
}

function updateVersion(){
  var filePath = base+"/bin/utils/help.js";
  //console.log(filePath);
  fs.readFile(filePath, 'utf8', function (err,data) {
    if (err) {
      return console.error(err);
    }
    var updateDate = new Date();
    var formattedDate = updateDate.getFullYear() + "-" + ( updateDate.getMonth() + 1) + "-" +updateDate.getDate()
    //console.log(formattedDate);
    var result = data.replace(/Database:\s\d+-\d+\-\d+/g, "Database: "+formattedDate);
    fs.writeFile(filePath, result, 'utf8', function (err) {
     if (err) return console.error(err);
   });    
  });
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
    case 'download':
      return getDownloadUpdates(cmd, arg, message);
    case 'fixfiles':
      return getFixDBFiles(cmd, arg, message);
    case 'backup':
      return getBackupCurrentDB(cmd, arg, message);
    case 'restore':
      return getRestoreOldDB(cmd, arg, message);
    case 'updatedb':
      return getUpdateDB(cmd, arg, message);
  }
};

exports.commands = ['help', 'start', 'inline', 'command', 'filter', 'notice', 'supergroup', 'github','download','fixfiles','backup','restore','updatedb'];