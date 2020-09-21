const moment = require('moment');
function Parse(line, stream){

    var bilhete = {};
    if(line.substr(0,2) == "30"){
        let telefoneDestino = line.substr(164-1, 17).trimEnd();

        if(telefoneDestino.length > 11)
            telefoneDestino = telefoneDestino.length == 13 ? telefoneDestino.substr(2, 11) : telefoneDestino.substr(2, 10); //remove o codigo de pais caso tenha;
        
        bilhete.telefoneDestino = telefoneDestino;
        bilhete.data = line.substr(100 - 1, 8);
        bilhete.horario = line.substr(227 - 1, 6);
        bilhete.duracao = line.substr(189 - 1, 7);
        bilhete.valor = parseFloat(line.substr(238 - 1, 13)) / 100.;
        bilhete.classe = line.substr(199 - 1, 3);
        bilhete.tipo = telefoneDestino.length == 11 ? 'Movel' : 'Fixo';
        bilhete.data = moment(`${bilhete.data}T${bilhete.horario}`).format('YYYY-MM-DD HH:mm:ss');
        // stream.write(`${telefoneDestino};${dataFormatada};${duracao};${valor};${classe};${tipo}\n`,()=>{});
    }
    return bilhete;
}

module.exports = {
    Parse
};