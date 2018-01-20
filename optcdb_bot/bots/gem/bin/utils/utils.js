String.prototype.replaceEntities = function () {
  return this.replace(/\s*<br>\s*/g, '\n').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ +(?= )/g, '').replace('&lt;b&gt;','\n<b>').replace('&lt;/b&gt;','</b>');
};
