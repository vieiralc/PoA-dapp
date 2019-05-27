window.addEventListener("load", function() {

    getProducts();
})

function getProducts() {
    $.get("/listProducts", function(res) {
        
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