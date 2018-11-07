/**
 * String Prototypes
 */

String.prototype.inlineCode = function() {
  return '`' + this + '`';
};

String.prototype.codeBlock = function(language) {
  if (language) return '```' + language + '\r\n' + this + '\r\n' + '```';
  else return '```' + '\r\n' + this + '\r\n' + '```';
};

String.prototype.italic = function() {
  return `*${this}*`;
};

String.prototype.bold = function() {
  return `**${this}**`;
};

String.prototype.underline = function() {
  return `__${this}__`;
};

String.prototype.prefixed = function() {
  return process.env['CMD_PREFIX'] + this;
};

String.prototype.newLine = '\r\n';

/**
 * Lang Format Function
 */

const util = require('util');

String.prototype.format = function(...template) {
  return util.format(this, template);
};
