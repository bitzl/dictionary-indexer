'use strict';

const commander = require('commander'),
    elasticsearch = require('elasticsearch'),
    filter = require('stream-filter'),
    fs = require('fs'),
    byline = require('byline'),
    indexing = require('./lib/indexing'),
    transformer = require('./lib/transformer'),
    util = require('./lib/util'),
    iconv = require('iconv-lite');

commander
  .version('0.0.1')
  .option('-f, --file <file>', 'Download source from URL.')
  .option('-u, --url <url>', 'Download source from URL.')
  .option('-e, --encoding <encoding>', 'Encoding.', 'utf-8')
  .option('-n, --bulk-size <bulkSize>', 'Bulk size for indexing.', 5000)
  .parse(process.argv);

if (commander.file) {
  var stream = fs.createReadStream(commander.file);
  main(stream, commander.encoding, commander.bulkSize);
} else if (commander.url) {
  var http;
  if (commander.url.startsWith('https')) {
    http = require('https');
  } else {
    http = require('http');
  }
  http.get(commander.url, function (response) {
    main(response, commander.encoding, commander.bulkSize);
  });
} else {
  commander.help();
}

function main(stream, encoding, bulkSize) {

  // var client = new indexing.ConsoleClient();
  var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info',
  });

  var indexer = new indexing.Indexer(client, 'words', 'word');

  var domainStream = stream
    .pipe(iconv.decodeStream(encoding))
    .pipe(byline.createStream())
    .pipe(filter(function (line) {
      return !(line.startsWith('<') || line.startsWith('#') || line.length === 0 || (line.indexOf('.') > -1));
    }))
    .pipe(new transformer.HunspellLineToWord());

  var performanceMeter = new util.PerformanceMeter();

  domainStream.on('data', function (domain) {
    if (indexer.bufferedItems() > bulkSize) {
      indexer.process();
      performanceMeter.round(indexer.total);
    }
    indexer.add(domain);
  });

  domainStream.on('end', function () {
    indexer.process();
    client.close();
  });
}
