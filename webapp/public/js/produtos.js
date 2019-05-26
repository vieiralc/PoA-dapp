window.addEventListener("load", function() {

    // carrega produtos enviados do servidor
    getProducts();
    
    // restaga formulário de login
    let form = document.getElementById("addProducts");

    // adiciona uma função para
    // fazer o login quando o 
    // formulário for submetido
    form.addEventListener('submit', addProduct);
})

function addProduct() {

    // previne a página de ser recarregada
    event.preventDefault();

    $('#load').attr('disabled', 'disabled');

    // resgata os dados do formulário
    let produto = $("#produto").val();
    let preco = $("#preco").val();

    // envia a requisição para o servidor
    $.post("/addProducts", {produto: produto, preco: preco}, function(res) {
        
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> produtos.js -> addProduct: ***", res.msg);            
            
            // remove atributo disabled do botao
            $('#load').attr('disabled', false);

            // adiciona o produto na tabela
            let newRow = $("<tr>");
            let cols = "";

            cols += `<td> ${1} </td>`;
            cols += `<td> ${produto} </td>`;
            cols += `<td> ${preco} </td>`;
            
            newRow.append(cols);
            $("#products-table").append(newRow);
        } else {
            alert("Erro ao cadastrar produto. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}

function getProducts() {
    $.get("/getProducts", function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> produtos.js -> getProducts: ***", res.msg);

            let produtos = res.produtos;

            // adiciona produtos na tabela
            for (let i = 0; i < produtos.length; i++) {
                let newRow = $("<tr>");
                let cols = "";

                cols += `<td> ${produtos[i].id} </td>`;
                cols += `<td> ${produtos[i].produto} </td>`;
                cols += `<td> ${produtos[i].preco} </td>`;
                
                newRow.append(cols);
                $("#products-table").append(newRow);
            }
            
        } else {
            alert("Erro ao resgatar produtos do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}