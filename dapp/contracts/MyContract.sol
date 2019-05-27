pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract MyContract {

    // evento para notificar o cliente
    // de que a conta foi atualizada
    event userRegisted(address _addr, string newEmail);
    event productRegistered(uint id);

    // estrutura para manter dados
    // do usuário
    struct User {
        string email;
    }

    // estrutura para manter dados do produto
    struct Product {
        uint id;
        string desc;
        uint price;
        address owner;
    }

    // mapeia um id a um produto
    mapping (uint => Product) products;

    // mapping para resgatar produtos de um usuário
    mapping (address => uint[]) productsOfOwner;

    uint256 private lastId = 0;

    // mapeia endereço do usuário
    // a sua estrutura
    mapping (address => User) users;

    // função para cadastrar
    // a conta do usuário
    function setUser(address _addr, string memory _email) public {
        User storage user = users[_addr];
        user.email = _email;

        // notifica o cliente através do evento
        emit userRegisted(_addr, "Conta registrada!");
    }

    // função para resgatar
    // dados do usuário
    function getUser(address _addr) public view returns(string memory) {
        User memory user = users[_addr];
        return (user.email);
    }

    // função para cadastrar um produto
    function addProduct(string memory _desc, uint _price) public returns(uint) {
        require(bytes(_desc).length >= 1, "Name invalid");
        require(_price > 0, "Price must be higher than zero");

        lastId++;
        products[lastId] = Product(lastId, _desc, _price, msg.sender);
        productsOfOwner[msg.sender].push(lastId);

        emit productRegistered(lastId);
    }

    // função para resgatar info de um produto
    function productInfo(uint _id) public view returns(uint, string memory, address, uint) {
        require(_id <= lastId, "Product does not exist");

        Product memory product = products[_id];
        return (product.id, product.desc, products[_id].owner, product.price);
    }

    // função que retorna todos os produtos de um usuario
    function getProducts(address _owner) public view returns(uint[] memory, string[] memory, address[] memory, uint[] memory) {

       uint[] memory ids = new uint[](productsOfOwner[_owner].length);
       string[] memory names = new string[](productsOfOwner[_owner].length);
       address[] memory owners = new address[](productsOfOwner[_owner].length);
       uint[] memory prices = new uint[](productsOfOwner[_owner].length);

       for(uint i = 0; i < productsOfOwner[_owner].length; i++) {
           (ids[i],names[i],owners[i],prices[i]) = productInfo(productsOfOwner[_owner][i]);
       }

       return (ids, names, owners, prices);
   }

}