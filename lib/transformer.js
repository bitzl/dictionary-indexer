"use strict";

const filter = require('stream-filter'),
  Transform = require('stream').Transform,
  util = require('util');

var HunspellLineToWord = function() {
  Transform.call(this, {objectMode: true});
};

util.inherits(HunspellLineToWord, Transform);

HunspellLineToWord.prototype._transform = function(chunk, encoding, callback) {
  chunk = chunk.toString();
  var endOfWord = chunk.indexOf("/");
  var word = chunk;
  if (endOfWord > -1) {
    word = chunk.substring(0, endOfWord);
  }
  this.push(word.trim());
  callback();
};

var WordToDomain = function(tld) {
  Transform.call(this, {objectMode: true});
  this.tld = tld;
};

util.inherits(WordToDomain, Transform);

WordToDomain.prototype._transform = function(chunk, encoding, callback) {
  this.push(chunk.toLowerCase() + "." + this.tld);
  callback();
};

const filterValidLines = filter(function (line) {
  const removeThisLine = line.startsWith('<')
  || line.startsWith('#')
  || line.length === 0
  || (line.indexOf('.') > -1);
  return !removeThisLine;
});

module.exports.HunspellLineToWord = HunspellLineToWord;
module.exports.WordToDomain = WordToDomain;
module.exports.filterValidLines = filterValidLines;
