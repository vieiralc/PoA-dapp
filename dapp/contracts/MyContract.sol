pragma solidity ^0.5.0;

contract MyContract {

    // evento para notificar o cliente
    // de que a conta foi atualizada
    event userUpdated(address _addr, string newEmail);

    // estrutura para manter dados
    // do usuario
    struct User {
        string email;
    }

    // mapea endereco do usuario
    // a sua estrutura
    mapping (address => User) users;

    // funcao para cadastrar/atualizar
    // a conta do usuario
    function setUser(address _addr, string memory _email) public {
        User storage user = users[_addr];
        user.email = _email;

        // notifica o cliente atraves do evento
        emit userUpdated(_addr, "Conta atualizada!");
    }

    // funcao para resgatar
    // dados do usuario
    function getUser(address _addr) public view returns(string memory) {
        User memory user = users[_addr];
        return (user.email);
    }

}