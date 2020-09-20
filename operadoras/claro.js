const moment = require('moment');
function Parse(line, stream){

    if(line.substr(0,2) == "30"){
        let telefoneDestino = line.substr(164-1, 17).trimEnd();
        
        if(telefoneDestino.length > 11)
            telefoneDestino = telefoneDestino.length == 13 ? telefoneDestino.substr(2, 11) : telefoneDestino.substr(2, 10); //remove o codigo de pais caso tenha;
        
        let data = line.substr(100 - 1, 8);
        let horario = line.substr(227 - 1, 6);
        let duracao = line.substr(189 - 1, 7);
        let valor = parseFloat(line.substr(238 - 1, 13)) / 100.;
        let classe = line.substr(199 - 1, 3);
        let tipo = telefoneDestino.length == 11 ? 'Movel' : 'Fixo';
        var dataFormatada = moment(`${data}T${horario}`).format('DD-MM-YYYY hh:mm:ss');
        stream.write(`${telefoneDestino};${dataFormatada};${duracao};${valor};${classe};${tipo}\n`,()=>{});
    }
}

module.exports = {
    Parse
};