let data_B = window.electronAPI.getProductsDB();

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

})

function createList(data, columns = 1) {
    const list = document.getElementById("productList");
    let row = null;
    let count = 0;
  
    for (const item of data) {
      if (count % columns === 0) {
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
      itemDiv.classList.add("align-items-center");
  
      row.appendChild(itemDiv);
  
      for (const prop of Object.values(item)) {
        const propElement = document.createElement("div");
        propElement.textContent = prop;
        propElement.style.width = `${Math.floor(100 / numProps)}%`;
        propElement.classList.add("text-center");
        itemDiv.appendChild(propElement);
      }
  
      count++;
    }
  }