const moment = require('moment');
async function Parse(line, stream){
    var columns = line.split(";");

    if(columns.length == 20){
        let telefoneDestino = columns[13].trim();

        if(telefoneDestino.length > 11)
            telefoneDestino = telefoneDestino.length == 13 ? telefoneDestino.substr(2, 11) : telefoneDestino.substr(2, 10); //remove o codigo de pais caso tenha;

        telefoneDestino = telefoneDestino.length == 13 ? telefoneDestino.substr(2, 11) : telefoneDestino.substr(2, 10); //remove o codigo de pais caso tenha;

        let dataFormatada = columns[9].substr(0, 19)
        let duracaoFormatada = columns[17].substr(0, 8);

        var a = duracaoFormatada.split(':');
        var duracao = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); //coverte o formato hh:mm:ss para duracao em segundos.

        let valor = parseFloat(columns[18]);
        let classe = columns[15];
        let tipo = columns[15] == 'M' ? 'Movel' : 'Fixo';
        await stream.write(`${telefoneDestino};${dataFormatada};${duracao};${valor};${classe};${tipo}\n`);
    }
}

module.exports = {
    Parse
};