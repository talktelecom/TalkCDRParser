const moment = require('moment');
function Parse(line, stream){
    var columns = line.split(";");
    var bilhete = {};
    if(columns.length == 20){
        let telefoneDestino = columns[13].trim();

        if(telefoneDestino.length > 11)
            telefoneDestino = telefoneDestino.length == 13 ? telefoneDestino.substr(2, 11) : telefoneDestino.substr(2, 10); //remove o codigo de pais caso tenha;

        bilhete.telefoneDestino = telefoneDestino;
        bilhete.dataFormatada = columns[9].substr(0, 19)
        bilhete.duracaoFormatada = columns[17].substr(0, 8);

        var a = bilhete.dataFormatada.split(':');
        bilhete.duracao = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); //coverte o formato hh:mm:ss para duracao em segundos.

        bilhete.valor = parseFloat(columns[18]);
        bilhete.classe = columns[15];
        bilhete.tipo = columns[15] == 'M' ? 'Movel' : 'Fixo';
        // stream.write(`${telefoneDestino};${dataFormatada};${duracao};${valor};${classe};${tipo}\n`,()=>{});
    }
    return bilhete;
}

module.exports = {
    Parse
};