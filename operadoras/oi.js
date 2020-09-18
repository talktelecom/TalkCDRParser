const moment = require('moment');
async function Parse(line, stream){

    if(line.substr(0,1) == "3"){
        let telefoneDestino = line.substr(156 - 1, 14).trimEnd();
        telefoneDestino = telefoneDestino.length == 13 ? telefoneDestino.substr(2, 11) : telefoneDestino.substr(2, 10); //remove o codigo de pais caso tenha;
        let data = line.substr(89 - 1, 8);
        let horario = line.substr(231 - 1, 6);
        let duracao = (parseFloat(line.substr(172 - 1, 6)) / 10) * 60; // operadora envia informação em decimos de segundos
        let valor = parseFloat(line.substr(272 - 1, 13)) / 100.;
        let classe = line.substr(178 - 1, 3);
        let tipo = telefoneDestino.length == 11 ? 'Movel' : 'Fixo';
        var dataFormatada = moment(`${data}T${horario}`).format('DD-MM-YYYY hh:mm:ss');
        await stream.write(`${telefoneDestino};${dataFormatada};${duracao};${valor};${classe};${tipo}\n`);
    }
}

module.exports = {
    Parse
};