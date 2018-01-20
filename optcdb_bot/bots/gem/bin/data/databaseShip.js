'use strict';

var path = require('path');
var base = path.join(__dirname, '../..');

var ships = require(path.join(base, 'data/shipsDB.js'));

function getShipInfo(id,type) {
  var ship_info = ships[id],
  response;
  if (ship_info) {
    response = '\ud83d\udea2<b>S H I P #'+id+'</b>\n\n'
    response += "<b>"+ship_info.name.toUpperCase()+"</b>\n\n";
    response += '<b>Description</b>\n\n';
    response += ship_info.description+"\n\n";
    response += '<a href="https://onepiece-treasurecruise.com/wp-content/uploads/' + ship_info.thumb+'">\u2007</a>\n';
    response += '<a href="https://t.me/OPTCNews">JPN NEWS</a> | <a href="https://discord.gg/pa5pBJd">Discord Group</a> | <a href="http://optc-news.com">News Archive</a>\n';
    response += '<b>J O I N   U S</b>\n<a href="https://telegram.me/joinchat/ABzveEDxZTiNLYTRO5-kQg">English group</a> | <a href="https://t.me/joinchat/ABzveENpurD6yuLWuTL18Q">Italian group</a> | <a href="https://t.me/joinchat/ABzveENMOZg4ZCXSqfziGA">Spanish group</a>\n';
    return response;
  }
}

module.exports = {
  getShipsDB: function() {
    return ships;
  },
  getShip: function(id) {
    return ships[id];
  },
  getShipInfo: function(id,type) {
    return getShipInfo(id,type);
  }
};

//https://onepiece-treasurecruise.com/wp-content/uploads/ship_0001_c.png -> ship field = thumb: