$("#addProductBtn").click(()=>{
    let product = 
    {
        name:  $("#productName").val(),
        skull: $("#productSku").val(),
        price: $("#productPrice").val(),
        stock: $("#productStock").val(),
        description: $("#productDescription").val()
    };
    window.electronAPI.addProductDB(product);

    let data_B = window.electronAPI.getProductsDB();
    let text   = "<br><br>";

     for( let element of data_B  )
     {
          for(const info in element)
          {
               text += element[info]+"-";
          }

          text += "<br><br>";
     }

     $("#productList").html(text);

})


let data_B = window.electronAPI.getProductsDB();
let text   = "<br><br>";

for( let element of data_B  )
{
    for(const info in element)
    {
        text += element[info]+"-";
    }

    text += "<br><br>";
}

$("#productList").html(text);
