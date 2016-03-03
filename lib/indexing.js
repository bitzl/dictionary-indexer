"use strict";

var ConsoleClient = function() {};

ConsoleClient.prototype.bulk = function(data, callback) {
  console.log("INDEX:");
  console.log(data);
};

var Indexer = function(client, index, type) {
  this.data = [];
  this.command = { index: { _index: index, _type: type } }
  this.client = client;
  this.total = 0;
}

Indexer.prototype.add = function(word) {
  this.data.push(this.command);
  this.data.push({ word: word });
}

Indexer.prototype.index = function() {
  this.client.bulk({ body: this.data });
  this.total += this.bufferedItems();
  this.data = [];
};

Indexer.prototype.bufferedItems = function() {
  return this.data.length / 2;
};

module.exports.ConsoleClient = ConsoleClient;
module.exports.Indexer = Indexer;
