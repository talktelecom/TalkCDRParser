const moment = require('moment');
function Parse(line, stream){

    var bilhete = {};
    if(line.substr(0,1) == "3"){
        let telefoneDestino = line.substr(156 - 1, 14).trimEnd();

        if(telefoneDestino.length > 11)
            telefoneDestino = telefoneDestino.length == 13 ? telefoneDestino.substr(2, 11) : telefoneDestino.substr(2, 10); //remove o codigo de pais caso tenha;

        bilhete.telefoneDestino = telefoneDestino;

        bilhete.data = line.substr(89 - 1, 8);
        bilhete.horario = line.substr(231 - 1, 6);
        bilhete.duracao = (parseFloat(line.substr(172 - 1, 6)) / 10) * 60; // operadora envia informação em decimos de segundos
        bilhete.valor = parseFloat(line.substr(272 - 1, 13)) / 100.;
        bilhete.classe = line.substr(178 - 1, 3);
        bilhete.tipo = telefoneDestino.length == 11 ? 'Movel' : 'Fixo';
        bilhete.dataFormatada = moment(`${data}T${horario}`).format('DD-MM-YYYY hh:mm:ss');
        // stream.write(`${telefoneDestino};${dataFormatada};${duracao};${valor};${classe};${tipo}\n`);
    }
    return bilhete;
}

function ParseCSV(line, stream){
   
// 0:' UF'
// 1:'FATURA'
// 2:'DOCUMENTO'
// 3:'LOCAL'
// 4:'MEIO'
// 5:'C'
// 6:'S'
// 7:'LOCAL-ORIG'
// 8:'FONE-ORIG'
// 9:'CJ-ORIG'
// 10:' SU-ORIG'
// 11:'PAG'
// 12:'LINHA'
// 13:'LOCAL-DEST'
// 14:' LOCAL-DEST'
// 15:'FONE-DEST'
// 16:'HORA'
// 17:'COD'
// 18:'DESC-RESU-COD'
// 19:'VALOR'
// 20:' DURACAO'
// 21:'DEGRAU'
// 22:'GRUPO-HOR'
// 23:'PULSOS'
// 24:'CONCESSIONARIA'
// 25:' PERC-ICMS'
// 26:'PERC-IMPOSTO'
// 27:'COD-EMPRESA                     '
// 28:'PROD'
// 29:'BLQ-PRESTADORA'
// 30:'NOTA-FISCAL'
// 31:'SERIE-NF'
// 32:'BLOCO'
// 33:'DT-SERVICO'
// 34:'VLR-SERVICO-ICMS'
// 35:'VLR-IMPOSTO'
// 36:'DT-VENC'
// 37:'DT-RECEB'
// 38:'DT-FATURA'
// 39:'DT-COBRANCA'
// 40:'DT-NOVO-VENC'
// 41:'DT-CAIXA'
// 42:'DT-CONTA'
// 43:'CLIENTE'
// 44:'NRC   

    var columns = line.split(";");
    var bilhete = {};
    if(columns.length == 45){
        let telefoneDestino = columns[15].trim();

        if(telefoneDestino.length > 11)
            telefoneDestino = telefoneDestino.length == 13 ? telefoneDestino.substr(2, 11) : telefoneDestino.substr(2, 10); //remove o codigo de pais caso tenha;

        telefoneDestino = telefoneDestino.length == 13 ? telefoneDestino.substr(2, 11) : telefoneDestino.substr(2, 10); //remove o codigo de pais caso tenha;

        let data = columns[33].substr(0, 8);
        let horario = columns[16].substr(0, 8).replace(/\:/g, "");

        if (horario == "000000")
            horario = "00:00:00";
        
        var dataFormatada = moment(`${data}T${horario}`).format('DD-MM-YYYY hh:mm:ss');

        let duracaoFormatada = columns[20].substr(0, 8);
        var a = duracaoFormatada.split(':');
        var duracao = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); //coverte o formato hh:mm:ss para duracao em segundos.

        let valor = parseFloat(columns[19].replace(/\,/g, "."));
        let classe = columns[18];
        let tipo = columns[18] = 'DDD' ? 'Fixo' : 'Movel';
        stream.write(`${telefoneDestino};${dataFormatada};${duracao};${valor};${classe};${tipo}\n`,()=>{});
    }
    return bilhete;
}

module.exports = {
    Parse,
    ParseCSV
};