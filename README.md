# Talk.CDR.Parser

Programa em node criado para leitura de arquivos de CDR de operadoras e transforma-los em um formato padrão para facil leitura e processamento.

Pré Requisitos:
- Sistema operacional Windows, Linux ou Max compativeis com a versão mais estavel do NodeJS
- NodeJS v10.22.1 ou superior
- Git

Codigos de Layouts Implementados
- 1 - Claro
- 2 - OI
- 3 - IPCorp
- 4 - TalkTelecom
- 5 - OI-CSV

Execute os comandos abaixo no terminal de sua preferencia
```
git clone https://github.com/talktelecom/TalkCDRParser
cd TalkCDRParser
npm install
node parser.js /CDR/Claro/CDR.txt 1
```
No exemplo acima esta sendo fornecido dois parametros para o programa. O primeiro é o path do arquivo e o segundo o codigo do layout.

Após o termino da execução, será apresentado no console a quantidade de linhas lidas e a data de termino do processamento. Na mesma pasta do arquivo fornecedido como paratro será gerado um arquivo de saida com o nome original + .parsed.txt. Ex: CDR.txt.parsed.txt

Layout do arquivo de saida
```
telefone;data;duracao;valor;classe;tipo
32069413;06-03-2020 05:39:26;0000060;0.01;LDN;Fixo
37627570;09-03-2020 02:29:49;0000036;0;LDN;Fixo
37627570;09-03-2020 04:48:57;0000030;0;LDN;Fixo
```

