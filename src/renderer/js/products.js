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

    listProducts();

})

document.getElementById("searchBarInput").addEventListener("keyup",function(event){
  filterList(this.value);
})

function listProducts() 
{
    const list = document.getElementById("productList");

    const data_B = window.electronAPI.getProductsDB();
    
    list.innerHTML="";

    createList(data_B);
}

//This function read the data 
//of a JSON and print at a DIV with
// id="productList" a list of the each
//data

function createList(data, columns = 1) 
{
    const list = document.getElementById("productList");
    let row = null;
    let count = 0;
  
    for (const item of data) 
    {
      if (count % columns === 0) 
      {
        row = document.createElement("div");
        row.classList.add("row");
        list.appendChild(row);
      }
  
      const numProps = Object.keys(item).length;
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("col");
      itemDiv.classList.add("bg-white");
      itemDiv.classList.add("rounded");
      itemDiv.classList.add("p-3");
      itemDiv.classList.add("mb-3");
      itemDiv.classList.add("d-flex");
      itemDiv.classList.add("button-c-dark");
      itemDiv.classList.add("align-items-center");
  
      row.appendChild(itemDiv);
  
      for (const prop of Object.values(item)) 
      {
        const propElement = document.createElement("div");
        propElement.textContent = prop;
        propElement.style.width = `${Math.floor(100 / numProps)}%`;
        propElement.classList.add("text-center");
        itemDiv.appendChild(propElement);
      }
  
      count++;
    }
  }

function filterList(text) 
{
  const list = document.getElementById("productList");
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
  

