"use strict";

var expect = require('chai').expect,
    Indexer = require('../lib/indexing').Indexer;

var MockClient = function() {
  this.data = null;
};
MockClient.prototype.bulk = function(data) {
  this.data = data;
};


describe('Indexer', function() {
   describe('collect data', function() {
     context('when word is given', function() {
       it('should add a indexing request.', function() {
         var indexer = new Indexer(null, 'testindex', 'testtype');
         indexer.add('a-nice-word');
         expect(indexer.data[0]).to.deep.equal({ create: { _index: 'testindex', _type: 'testtype', _id: 'a-nice-word' } });
       });
       it('should add a document containing the word.', function() {
         var indexer = new Indexer(null, 'testindex', 'testtype');
         indexer.add('a-nice-word');
         expect(indexer.data[1]).to.deep.equal({ word: 'a-nice-word' });
       });
     });
   });
   describe('index data', function() {
     context('when index is called', function() {
       it('should send all the data to the indexing client', function() {
         var client = new MockClient();
         var indexer = new Indexer(client, 'testindex', 'testtype');
         var itemCount = 10;
         for (var i = 0; i < itemCount; i++) {
           indexer.add('a-nice-word');
         }
         indexer.process();
         expect(client.data.body.length).to.equal(2 * itemCount);
       });
     });
   });
 });
