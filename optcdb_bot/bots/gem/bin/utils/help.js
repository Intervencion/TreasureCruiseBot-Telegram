'use strict';

var path = require('path');
var base = path.join(__dirname, '../..');

module.status = require(path.join(base, 'bin/utils/status.js'));

function getHelpText() {
  var response = '<b>Modalità inline:</b>\n\n';
  response += 'Usala in qualsiasi chat.\n';
  response += '1. Scrivi @TreasureCruiseBot seguito dalle parole chiave\n';
  response += '2. Tocca su uno dei risultati per informazioni dettagliate\n\n';
  response += '<b>Modalità di comandi:</b>\n\n';
  response += 'Usala nei gruppi.\n';
  response += '1. Invia /search per cercare un\'unità \n';
  response += '2. Invia le tue parole chiave\n';
  response += '3. Tocca su uno dei risultati per informazioni dettagliate\n\n';
  response += 'Parla al bot direttamente.\n';
  response += '1. Invia le tue parole chiave\n';
  response += '2. Tocca su uno dei risultati per informazioni dettagliate\n\n';
  response += '<b>Comandi extra:</b>\n';
  response += '/supergroup - Unisciti alla nostra ciurma!\n';
  response += '/inline - Qui troverai le istruzioni per usare la modalità inline\n';
  response += '/command - Qui troverai le istruzioni per usare la modalità di comando\n';
  response += '/rate - Dai un voto a questo bot su @Storebot\n';
  response += '/notice - Controlla le notizie degli sviluppatori\n';
  response += '/random - Ottieni le informazioni su un\'unità a caso \n';
  response += '/bonus - un link per la tavola dei bonus\n';
  response += '/drops - un link per la pagina dei drop\n';
  response += '/github - un link per il codice sorgente\n';
  response += '/help - visualizza questa scheda\n\n';
  response += '<b>Divertiti!</b>\n';
  response += 'Sviluppato da trashbytes\n';
  response += 'Mantenuto da @Intervencion\n\n';
/*  response += '<b>Nota:</b> Questo bot è costantemente sotto sviluppo, potrebbe comparire un bug ogni tanto.\n\n';*/
  response += 'Database: 2016-12-18\n';
  return response;
}

function getStart(cmd, arg, message) {
  module.status.addRequest('start');
  var response = '<b>B E N V E N U T O</b>\n\n' + getHelpText();
  return {
    text: response,
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Avvio!',
          switch_inline_query: ''
        }]
      ]
    },
    chat_id: message.chat.id
  };
}

function getHelp(cmd, arg, message) {
  module.status.addRequest('help');
  var response = '<b>I S T R U Z I O N I</b>\n\n' + getHelpText();
  return {
    text: response,
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Avvio!',
          switch_inline_query: ''
        }]
      ]
    },
    chat_id: message.chat.id
  };
}

function getInline(cmd, arg, message) {
  module.status.addRequest('help');
  var response = '<b>I S T R U Z I O N I/b>\n\n';
  response += '<b>Modalità inline:</b>\n';
  response += 'La modalità inline abilità il bot ad essere usato in <b>qualsiasi</b> chat, gruppo o canale – non importa se il bot sia un membro o meno.\n';
  response += '<i>(Consiglio: Tieni a mente che la modalità inline non permette l\'uso di comandi incorporati come i collegamenti direttili alle evoluzioni!)</i>\n\n';
  response += '<b>Istruzioni:</b>\n';
  response += 'Scrivi @TreasureCruiseBot, seguito da qualche parola chiave. Il bot ti offrirà una lista di risultati. Tocca uno dei risultati per inviarlo istantaneamente in chat!.\n\n';
  response += '<b>Esempio:</b>\n';
  response += '@TreasureCruiseBot boa hancock';
  return {
    text: response,
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Proviamo questo!',
          switch_inline_query: 'boa hancock'
        }]
      ]
    },
    chat_id: message.chat.id
  };
}

function getCommand(cmd, arg, message) {
  var response = '<b>I S T R U Z I O N I</b>\n\n';
  response += '<b>Modalità di comando:</b>\n';
  response += 'La modalità di comando può essere usata parlando al bot direttamente, oppure in un gruppo, <b>se</b> il bot è un membro e la modalità di comando non è disabilitata.\n\n';
  response += '<b>Istruzioni:</b>\n';
  response += 'Invia /search e rispondi alla richiesta seguente con alcune parole chiave. Tocca un risultato della lista per ottenerne i dettagli.\n';
  response += '<i>(Consiglio: Puoi omettere l\'uso di "/search" e inviare direttamente le parole chiave mentre stai parlando con il bot!)</i>\n\n';
  response += '<b>Esempio:</b>\n';
  response += '/search\n';
  response += '<i>aspetta per la richiesta...</i>\n';
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
  var response = '<b>I S T R U Z I O N I</b>\n\n';
  response += '<b>Filtraggio:</b>\n';
  response += 'Ho rimosso il filtro per ora. La mia implementazione non era troppo stabile, purtroppo. Sto lavorando ad una nuova versione con un miglior filtraggio.';
  return {
    text: response,
    chat_id: message.chat.id
  };
}

function getNotice(cmd, arg, message) {
  module.status.addRequest('notice');
  var response = '<b>N O T I Z I E</b>\n\n';
  response += 'Salve a tutti!\n\n';
  response += 'L\'ex sviluppatore (Mr. Trashbytes) non sta lavorando più al bot.\n\n';
  response += 'A causa di ciò, ho dovuto rinunciare all\'idea di lavorare sul filtraggio, per ora (dal momento in cui Io -Intervención- non so come farlo\).n\n';
  response += 'Ad ogni modo, il database è aggiornato.\n\n';
  response += '@Intervencion, 18 Settembre 2016';
  return {
    text: response,
    disable_web_page_preview: true,
    chat_id: message.chat.id
  };
}

function getSupergroup(cmd, arg, message) {
  module.status.addRequest('supergroup');
  var response = '<b>S U P E R G R U P P O</b>\n\n';
  response += 'Unisciti nel nostro supergruppo per viaggiare nel mondo di One Piece insieme!';
  return {
    text: response,
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Unisciti ora!',
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
  response += 'Controlla come sono stato fatto';
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
