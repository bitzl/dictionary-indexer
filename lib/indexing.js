"use strict";

var ConsoleClient = function() {};

ConsoleClient.prototype.bulk = function(data, callback) {
  console.log("INDEX:");
  console.log(data);
};

var Indexer = function(client, index, type) {
  this.data = [];
  this.index = index;
  this.type = type;
  this.client = client;
  this.total = 0;
};

Indexer.prototype.add = function(word) {
  word = word.toLowerCase();
  this.data.push({ create: { _index: this.index, _type: this.type, _id: word } });
  this.data.push({ word: word });
};

Indexer.prototype.process = function() {
  this.client.bulk({ body: this.data });
  this.total += this.bufferedItems();
  this.data = [];
};

Indexer.prototype.bufferedItems = function() {
  return this.data.length / 2;
};

module.exports.ConsoleClient = ConsoleClient;
module.exports.Indexer = Indexer;
