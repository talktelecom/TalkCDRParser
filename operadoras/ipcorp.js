const moment = require('moment');
async function Parse(line, stream){
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
    if(columns.length == 20){
        let telefoneDestino = columns[9].trim();

        if(telefoneDestino.length > 11)
            telefoneDestino = telefoneDestino.length == 13 ? telefoneDestino.substr(2, 11) : telefoneDestino.substr(2, 10); //remove o codigo de pais caso tenha;

        let dataFormatada = columns[10].substr(0, 19)
        let duracaoFormatada = columns[18].substr(0, 8);

        var a = duracaoFormatada.split(':');
        var duracao = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); //coverte o formato hh:mm:ss para duracao em segundos.

        let valor = parseFloat(columns[19]);
        let classe = columns[17];
        let tipo = columns[17] == 'M' ? 'Movel' : 'Fixo';
        await stream.write(`${telefoneDestino};${dataFormatada};${duracao};${valor};${classe};${tipo}\n`);
    }
}

module.exports = {
    Parse
};