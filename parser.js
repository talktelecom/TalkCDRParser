const moment = require('moment');
const lineReader = require('line-reader');
const fs = require('fs');
const claro = require('./operadoras/claro');
const oi = require('./operadoras/oi');
const ipcorp = require('./operadoras/ipcorp');
const talktelecom = require('./operadoras/talktelecom');
const { exception } = require('console');

var file = "/Users/valdez.bonfim/CDR/Talk-CDR-Parser/exemplos/Faturas-Operadoras-Claro.txt";
var layout = 1;
var lineIndex = 0;

if(process.argv.length > 2)
    file = process.argv[2];

if(process.argv.length > 3)
    layout = process.argv[3];

fs.unlink(file + '.parsed.txt', ()=>{ });
var stream = fs.createWriteStream(file + '.parsed.txt', {flags: 'a'}); 
stream.write(`telefone;data;duracao;valor;classe;tipo\n`,()=>{});


try {
    if (fs.existsSync(file) && layout > 0) {
        console.log(`Start Time: ${moment(new Date()).format('DD/MM/YYYY HH:mm:ss')}`);
        lineReader.eachLine(file, function(line, last) {
            lineIndex++;
            if(!last)
                process.stdout.write(`\rProcessing Line ${lineIndex} ${moment(new Date()).format('HH:mm:ss')}`);
            else
                process.stdout.write(`\rFinish Time ${moment(new Date()).format('DD/MM/YYYY HH:mm:ss')} | Count lines: ${lineIndex}`);

            if(layout == 1){ // claro
                claro.Parse(line, stream);
            }
            else if(layout == 2){ // oi 
                oi.Parse(line, stream);
            }
            else if(layout == 3){ // ipcorp
                if(lineIndex > 1) // pula o header
                    ipcorp.Parse(line, stream);
            }
            else if(layout == 4){ // talktelecom
                if(lineIndex > 1) // pula o header
                    talktelecom.Parse(line, stream);
            }
            else if(layout == 5){ // oi-csv
                if(lineIndex > 1) // pula o header
                oi.ParseCSV(line, stream);
            }
        });
    }
    else{
        console.log(`File not found: ${file}`);
    }
  } catch(err) {
    console.error(err)
  }