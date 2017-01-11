String.prototype.replaceEntities = function () {
  return this.replace(/\s*<br>\s*/g, '\n').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ +(?= )/g, '');
};
