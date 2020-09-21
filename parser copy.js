const moment = require('moment');
const lineReader = require('line-reader');
const fs = require('fs');

const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: 'http://elastic:changeme@172.16.1.174:9200'
})
require('array.prototype.flatmap').shim();


const claro = require('./operadoras/claro');
const oi = require('./operadoras/oi');
const ipcorp = require('./operadoras/ipcorp');
const talktelecom = require('./operadoras/talktelecom');

var uuid = require('uuid');
var file = "/Users/valdez.bonfim/CDR/CDR_AMA_TALK_JUL.txt";
var layout = 4;
var lineIndex = 0;


if(process.argv.length > 2)
    file = process.argv[2];

if(process.argv.length > 3)
    layout = process.argv[3];

fs.unlink(file + '.parsed.csv', ()=>{ });
var stream = fs.createWriteStream(file + '.parsed.csv', {flags: 'a'}); 
stream.write(`telefone;data;duracao;valor;classe;tipo\n`,()=>{});

// elastic.ping();
// elastic.deleteIndex('tweets');
// elastic.createIndex('cdr');
var bilhetes = [];

async function run (file, layout) {
    if (fs.existsSync(file) && layout > 0) {
        lineReader.eachLine(file, function(line) {
            lineIndex++;
            process.stdout.write(`\rProcessing Line ${lineIndex}`);

            var bilhete = {};
            if(layout == 1){ // claro
                bilhete = claro.Parse(line, stream);
            }
            else if(layout == 2){ // oi 
                bilhete = oi.Parse(line, stream);
            }
            else if(layout == 3){ // ipcorp
                if(lineIndex > 1) // pula o header
                bilhete = ipcorp.Parse(line, stream);
            }
            else if(layout == 4){ // talktelecom
                if(lineIndex > 1) // pula o header
                    bilhete = talktelecom.Parse(line, stream);
            }
            else if(layout == 5){ // oi-csv
                if(lineIndex > 1) // pula o header
                    bilhete = oi.ParseCSV(line, stream);
            }

            if(bilhete.telefoneDestino){
                bilhete.id = uuid.v1();
                bilhetes.push(bilhete);
            }
                
            if(bilhetes.length % 1000 == 0){
                const body = bilhetes.flatMap(doc => [{ index: { _index: 'bilhetetalk' } }, doc]);

                const { body: bulkResponse } = await client.bulk({ refresh: true, body })

                if(bulkResponse){
                    
                }
                // elastic.bulk("bilhetetalk", body);
                // const { body: bulkResponse }     =  elastic.bulk({ refresh: true, body })
                // bilhetes = [];
            }

        });
    }
    else{
        console.log(`File not found: ${file}`);
    }
};


run(file, layout).catch(console.log);