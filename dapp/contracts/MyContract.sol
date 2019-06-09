pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract MyContract {

    // evento para notificar o cliente que a conta foi atualizada
    event userRegisted(address _addr, string newEmail);
    // evento para notificar o cliente que o produto foi registrado
    event productRegistered(uint id);
    // evento para notificar o cliente de que a Etapa foi registrada
    event StageRegistered(uint[]);

    // estrutura para manter dados do usuário
    struct User {
        string email;
    }

    // estrutura para registar o estagio de um produto
    struct Stage {
        uint id;
        uint[] products;
        string desc;
        address owner;
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
    uint[] public productsIds;
    // mapping para resgatar produtos de um usuário
    //mapping (address => uint[]) productsOfOwner;

    // mapeia um id a uma etapa
    mapping(uint => Stage) stages;
    uint[] public stagesIds;
    // mapping para resgatar etapas dos produtos de um usuário
    //mapping (address => uint[]) productsStage;

    // mapeia endereço do usuário a sua estrutura
    mapping (address => User) users;

    // state variables
    uint256 private lastId = 0;
    uint256 private stagesId = 0;

    // função para cadastrar conta do usuário
    function setUser(address _addr, string memory _email) public {
        User storage user = users[_addr];
        user.email = _email;

        // notifica o cliente através do evento
        emit userRegisted(_addr, "Conta registrada!");
    }

    // função para resgatar dados do usuário
    function getUser(address _addr) public view returns(string memory) {
        User memory user = users[_addr];
        return (user.email);
    }

    // função para cadastrar um produto
    function addProduct(string memory _desc, uint _price) public returns(uint) {
        require(bytes(_desc).length >= 1, "Name invalid");
        require(_price > 0, "Price must be higher than zero");

        products[lastId] = Product(lastId, _desc, _price, msg.sender);
        productsIds.push(lastId);
        lastId++;
        
        emit productRegistered(lastId);
    }

    // função para resgatar info de um produto
    function productInfo(uint _id) public view returns(uint, string memory, address, uint) {
        require(_id <= lastId, "Product does not exist");

        Product memory product = products[_id];
        return (product.id, product.desc, products[_id].owner, product.price);
    }

    // função que retorna todos os produtos de um usuário
    function getProducts() public view returns(uint[] memory, string[] memory, address[] memory, uint[] memory) {

        uint[] memory ids = productsIds;

        uint[] memory idsProducts = new uint[](ids.length);
        string[] memory names = new string[](ids.length);
        address[] memory owners = new address[](ids.length);
        uint[] memory prices = new uint[](ids.length);

        for (uint i = 0; i < ids.length; i++) {
            (idsProducts[i], names[i], owners[i], prices[i]) = productInfo(i);
        }

        return (idsProducts, names, owners, prices);
    }

    // função para adicionar produtos à um estágio
    function addToStage(uint[] memory _productsIds, string memory _stageDesc) public {
        require(bytes(_stageDesc).length >= 1, "Name invalid");
        require(_productsIds.length > 0, "Price must be higher than zero");

        stages[stagesId] = Stage(stagesId, _productsIds, _stageDesc, msg.sender);
        stagesIds.push(stagesId);
        stagesId++;

        emit StageRegistered(_productsIds);
    }

    // função para resgatar info de um estágio
    function stageInfo(uint _id) public view returns (uint, uint[] memory, string memory, address) {
        require(_id <= stagesId, "Product stage does not exist");

        Stage memory stage = stages[_id];
        return (stage.id, stage.products, stage.desc, stage.owner);
    }

    // função que retorna todos os produtos de um usuário
    function getStages() public view returns (uint[] memory, uint[][] memory, string[] memory, address[] memory) {

        uint[] memory ids = productsIds;
        uint[] memory idsStages = new uint[](ids.length);
        uint[][] memory prods = new uint[][](ids.length);
        string[] memory prods_desc = new string[](ids.length);
        address[] memory owners = new address[](ids.length);

        for(uint i = 0; i < ids.length; i++) {
            (idsStages[i], prods[i], prods_desc[i], owners[i]) = stageInfo(i);
        }

        return (ids, prods, prods_desc, owners);
    }

}