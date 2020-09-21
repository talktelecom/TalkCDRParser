'use strict'
const moment = require('moment');
const lineReader = require('line-reader');
const fs = require('fs');

require('array.prototype.flatmap').shim()
const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: 'http://elastic:changeme@172.16.1.174:9200'
})

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

var bilhetes = [];

async function run () {

    if (fs.existsSync(file) && layout > 0) {
        lineReader.eachLine(file,async (line)=>{
            lineIndex++;
            process.stdout.write(`\rProcessing Line ${lineIndex}`);
            var bilhete = {};

            if(layout == 1){ // claro
                bilhete = claro.Parse(line);
            }
            else if(layout == 2){ // oi 
                bilhete = oi.Parse(line);
            }
            else if(layout == 3){ // ipcorp
                if(lineIndex > 1) // pula o header
                bilhete = ipcorp.Parse(line);
            }
            else if(layout == 4){ // talktelecom
                if(lineIndex > 1) // pula o header
                    bilhete = talktelecom.Parse(line);
            }
            else if(layout == 5){ // oi-csv
                if(lineIndex > 1) // pula o header
                    bilhete = oi.ParseCSV(line);
            }

            if(bilhete.telefoneDestino){
                bilhete.id = uuid.v1();
                bilhetes.push(bilhete);
            }

            if(bilhetes.length >= 1000){
                const body = bilhetes.flatMap(doc => [{ index: { _index: 'bilhetetalk' } }, doc]);

                const { body: bulkResponse } = await client.bulk({ refresh: true, body })

                if (bulkResponse.errors) {
                    const erroredDocuments = []
                    bulkResponse.items.forEach((action, i) => {
                        const operation = Object.keys(action)[0]
                        if (action[operation].error) {
                        erroredDocuments.push({
                            status: action[operation].status,
                            error: action[operation].error,
                            operation: body[i * 2],
                            document: body[i * 2 + 1]
                        })
                        }
                    })
                    console.log(erroredDocuments)
                }

                const { body: count } = await client.count({ index: 'tweets' })
                console.log(count);
                bilhetes = [];
            }
        });
    }

}

run().catch(console.log)