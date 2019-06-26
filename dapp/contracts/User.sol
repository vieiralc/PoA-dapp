pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract User {
    // evento para notificar o cliente que a conta foi atualizada
    event userRegisted(address _addr, string newEmail);

    struct UserInfo {
        string email;
    }

    mapping (address => UserInfo) users;

    // função para cadastrar conta do usuário
    function setUser(address _addr, string memory _email) public {
        UserInfo storage user = users[_addr];
        user.email = _email;

        // notifica o cliente através do evento
        emit userRegisted(_addr, _email);
    }

    // função para resgatar dados do usuário
    function getUser(address _addr) public view returns(string memory) {
        UserInfo storage user = users[_addr];
        return (user.email);
    }
}