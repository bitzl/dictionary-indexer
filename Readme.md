# Word Indexer

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
