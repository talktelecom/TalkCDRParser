const moment = require('moment');
const lineReader = require('line-reader');
const fs = require('fs');
const claro = require('./operadoras/claro');
const oi = require('./operadoras/oi');
const ipcorp = require('./operadoras/ipcorp');
const talktelecom = require('./operadoras/talktelecom');

var file = "/Users/valdez.bonfim/CDR/CDR-IPCORP-JUN-20.txt";
var layout = 3;
var lineIndex = 0;

if(process.argv.length > 2)
    file = process.argv[2];

if(process.argv.length > 3)
    layout = process.argv[3];

fs.unlink(file + '.parsed.csv', ()=>{ });
var stream = fs.createWriteStream(file + '.parsed.csv', {flags: 'a'}); 

try {
    if (fs.existsSync(file) && layout > 0) {
        lineReader.eachLine(file, function(line) {
            lineIndex++;
            process.stdout.write(`\rProcessing Line ${lineIndex}`);

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
                ipcorp.ParseCSV(line, stream);
            }
        });

        process.stdout.write(`\rProcesso finalizado. Linhas processadas ${lineIndex}`);
    }
    else{
        console.log(`arquivo não encontrado: ${file}`);
    }
  } catch(err) {
    console.error(err)
  }

async function ParserClaro(line){

    if(line.substr(0,2) == "30"){
        let telefoneOrigem = line.substr(84 - 1, 16).trimEnd();
        let telefoneDestino = line.substr(164-1, 17).trimEnd();
        let data = line.substr(100 - 1, 8);
        let horario = line.substr(227 - 1, 6);
        let duracao = line.substr(189 - 1, 7);
        let valor = parseFloat(line.substr(238 - 1, 13)) / 100.;
        let classe = line.substr(199 - 1, 3);
        let tipo = telefoneDestino.length == 11 ? 'Movel' : 'Fixo';
        var dataFormatada = moment(`${data}T${horario}`).format('DD-MM-YYYY hh:mm:ss');
        await stream.write(`${telefoneOrigem};${telefoneDestino};${dataFormatada};${duracao};${valor};${classe};${tipo}\n`);
    }
}




