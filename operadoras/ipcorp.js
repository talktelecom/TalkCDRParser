const moment = require('moment');
function Parse(line, stream){
    var columns = line.split(";");
    
    if(columns.length == 20){
        let telefoneDestino = columns[9].trim();

        if(telefoneDestino.length > 11)
            telefoneDestino = telefoneDestino.length == 13 ? telefoneDestino.substr(2, 11) : telefoneDestino.substr(2, 10); //remove o codigo de pais caso tenha;

        let dataFormatada = columns[10].substr(0, 19)
        let duracaoFormatada = columns[18].substr(0, 8);

        var a = duracaoFormatada.split(':');
        var duracao = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); //coverte o formato hh:mm:ss para duracao em segundos.
        let classe = columns[17];
        let tipo = columns[17] == 'M' ? 'Movel' : 'Fixo';
        stream.write(`${telefoneDestino};${dataFormatada};${duracao};0;${classe};${tipo}\n`,()=>{});
    }
}

module.exports = {
    Parse
};