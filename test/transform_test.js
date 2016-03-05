var expect = require('chai').expect,
    HunspellLineToWord = require('../lib/transformer').HunspellLineToWord,
    StreamTest = require('streamtest').v2;

describe('HunspellLineToWord', function() {
   describe('extractWordFromHunspellLine()', function() {
     context('when line is given', function() {
       it('should remove anything after the first "/".', function(done) {
         StreamTest.fromChunks(['abc/23,23/2192a/asd/212'])
          .pipe(new HunspellLineToWord())
          .pipe(StreamTest.toText(function(error, text){
              expect(text).to.equal('abc');
              done();
          }));
       });
       it('should remove any whitespace before and after.', function(done) {
         StreamTest.fromChunks(['  abc /23 '])
          .pipe(new HunspellLineToWord())
          .pipe(StreamTest.toText(function(error, text){
              expect(text).to.equal('abc');
              done();
          }));
       });
       it('should work with plain words without metadata.', function(done) {
         StreamTest.fromChunks(['abc'])
          .pipe(new HunspellLineToWord())
          .pipe(StreamTest.toText(function(error, text){
              expect(text).to.equal('abc');
              done();
          }));
       });
     });
   });
 });
