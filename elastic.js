const moment = require('moment');
var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'http://elastic:changeme@172.16.1.174:9200',
    log: 'trace'
  });   


function ping(){
    client.ping({
        requestTimeout: 30000,
        }, function (error) {
            if (error) {
                console.error('elasticsearch cluster is down!');
            } else {
                console.log('All is well');
            }
        });
}
function createIndex(indexName){
    client.indices.create({  
        index: indexName,
        body: {
            mappings: {
                properties: {
                  id: { type: 'text' },
                  telefoneDestino: { type: 'text' },
                  duracao: { type: 'integer' },
                  valor: { type: 'float' },
                  data: { type: 'date' },
                  classe : { type: 'keyword' },
                  classe : { type: 'keyword' },
                }
              }
        }
      },function(err,resp,status) {
        if(err) {
          console.log(err);
        }
        else {
          console.log("create",resp);
        }
      });
}

function deleteIndex(indexName){
    client.indices.delete({index: indexName},function(err,resp,status) {  
        console.log("delete",resp);
    });
}

function index(indexName, data){
    client.index({  
        index: indexName,
        id: data.id,
        type: indexName,
        body: data
      },function(err,resp,status) {
          console.log(resp);
      });
}

function count(indexName){
    client.count({index: indexName,type: indexName},function(err,resp,status) {  
        console.log("constituencies",resp);
    });
}

function deleteById(id, indexName){
    client.delete({  
        index: indexName,
        id: id,
        type: indexName
      },function(err,resp,status) {
          console.log(resp);
      });
}
 async function bulk(indexName, data){
    client.bulk({  
        index: indexName,
        type: indexName,
        body: data
      },function(err,resp,status) {
        console.log(resp);
    });
}

module.exports = {
    client,
    ping,
    createIndex,
    deleteIndex,
    index,
    count,
    bulk,
    deleteById,
};