### Instruções

#### Para rodar a blockchain

dentro da pasta blockchain <br>

Execute o seguinte comando: <br>

    parity --config nodes/node00/node.toml 

Em um outro terminal, execute os seguintes comandos: <br>

    curl --data '{"method":"parity_newAccountFromPhrase","params":["node00","node00"],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8540

O comando acima retornará um endereço da conta criada, copie este endereço pois o usaremos nos próximos passos. <br>
Para que o parity reconheça a conta pelo seu nome, use o comando abaixo: <br>

    curl --data '{"method":"parity_setAccountName","params":["0x00a1103c941fc2e1ef8177e6d9cc4657643f274b","node00"],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8540

Crie outras contas caso desejado. Descomente o código no arquivo /nodes/node00/node.toml <br>
Com o endereço da conta criada copiado cole nos arquivos: <br>

    /nodes/node00/node.toml (linha 13 e 18)
    /chain.json (linha 9 em "validators") // Aqui são indicados os nós validadores

Execute o comando: <br>

    parity --config nodes/node00/node.toml --unlock 0x00a1103c941fc2e1ef8177e6d9cc4657643f274b --password node.pwds

Com a flag --unlock o nó estará sempre desbloqueado para que se consiga fazer o deploy de um smart contract <br>

#### Para fazer o deploy do contrato

Agora que a blockchain esta rodando, entre na pasta dapp. Para fazer o deploy do contrato basta executar: <br>

    truffle migrate

Copie o endereço do contrato e cole em: <br>

webapp/index.js linha 17 <br>

#### Para executar o app

Dentro da pasta webapp <br>

    -> npm install
    -> npm start
