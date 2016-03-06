# Dictionary Indexer

Index a Hunspell dictionary to elasticsearch.

Create index:

    PUT words
    {
      "mappings": {
        "words": {
          "properties": {
            "word": {
              "type": "string",
              "index": "not_analyzed"
            }
          }
        }
      }
    }


Usage:

    $ node index.js
    
    Usage: index [options]
    
    Options:
    
      -h, --help                  output usage information
      -V, --version               output the version number
      -f, --file <file>           Download source from URL.
      -u, --url <url>             Download source from URL.
      -e, --encoding <encoding>   Encoding.
      -n, --bulk-size <bulkSize>  Bulk size for indexing.
