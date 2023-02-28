$("#addProductBtn").click(()=>{
    let product = 
    {
        name:        $("#productName").val(),
        skull:       $("#productSku").val(),
        price:       $("#productPrice").val(),
        stock:       $("#productStock").val(),
        description: $("#productDescription").val()
    };

    window.electronAPI.addProductDB(product);

    listProducts();

})

document.getElementById("searchBarInput").addEventListener("keyup",function(event){
  filterList(this.value,"productList");
})

function listProducts() 
{
    const list = document.getElementById("productList");

    const data_B = window.electronAPI.getProductsDB();
    
    list.innerHTML="";

    createList(data_B,"productList");
}

function filterList(text,id) 
{
  const list = document.getElementById(id);
  const rows = list.querySelectorAll(".row");

  for (const row of rows) 
  {
    const cols = row.querySelectorAll(".col");
    let rowMatches = false;

    for (const col of cols) 
    {
        const props = col.querySelectorAll("div");
        let colMatches = false;

        for (const prop of props) 
        {
          if (prop.textContent.toLowerCase().includes(text.toLowerCase())) 
          {
            colMatches = true;
            rowMatches = true;
            break;
          }
        }

        if (!colMatches) 
        {
          col.classList.add("d-none");
        } 
        else 
        {
          col.classList.remove("d-none");
        }
    }

    if (!rowMatches)
    {
      row.classList.add("d-none");
    } 
    else 
    {
      row.classList.remove("d-none");
    }
  }
}
  

