const moment = require('moment');
function Parse(line, stream){
    var columns = line.split(";");
    // 0:'IDIPCORP'
    // 1:'FATURA'
    // 2:'TG20'
    // 3:'TG20NOME'
    // 4:'TG40'
    // 5:'TG40NOME'
    // 6:'BILHETADOR'
    // 7:'CICLO_FATURAMENTO'
    // 8:'NA'
    // 9:'NB'
    // 10:'DATA_INICIO'
    // 11:'DATA_ATENDIMENTO'
    // 12:'DATA_DESCONEXAO'
    // 13:'RELCAUSE'
    // 14:'CHARGE'
    // 15:'FDS'
    // 16:'CADENCIA'
    // 17:'TIPO' 
    // 18:'DURACAO_TARIFADA'
    // 19:'PRECO'

    var bilhete = {};
    if(columns.length == 20){
        let telefoneDestino = columns[9].trim();

        if(telefoneDestino.length > 11)
            telefoneDestino = telefoneDestino.length == 13 ? telefoneDestino.substr(2, 11) : telefoneDestino.substr(2, 10); //remove o codigo de pais caso tenha;

        bilhete.telefoneDestino = telefoneDestino;
        bilhetedataFormatada = columns[10].substr(0, 19)
        bilheteduracaoFormatada = columns[18].substr(0, 8);

        var a = duracaoFormatada.split(':');
        bilheteduracao = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); //coverte o formato hh:mm:ss para duracao em segundos.

        bilhetevalor = parseFloat(columns[19]);
        bilheteclasse = columns[17];
        bilhetetipo = columns[17] == 'M' ? 'Movel' : 'Fixo';
        // stream.write(`${telefoneDestino};${dataFormatada};${duracao};${valor};${classe};${tipo}\n`,()=>{});
    }
    return bilhete;
}

module.exports = {
    Parse
};