const data_B = window.electronAPI.getProductsDB();

const productExample =  {
    name:  "Example",
    skull: "ABCD000",
    price: 10000,
    stock: 20,
    description: "An example product"
}

const billHead = {
    quantity:"Cantidad",
    description:"Decripción",
    price:"P. Unitario",
    total:"Valor Total"
};

function createItemsList(data, id, columns = 1) 
{
    const list = document.getElementById(id);
    let row = null;
    let count = 0;
  
    for (const item of data) 
    {
      if (count % columns === 0) 
      {
        row = document.createElement("div");
        row.classList.add("row");
        row.classList.add("w-100");
        list.appendChild(row);
      }
  
      const numProps = Object.keys(item).length;
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("col");
      itemDiv.classList.add("bg-white");
      itemDiv.classList.add("rounded");
      itemDiv.classList.add("p-3");
      itemDiv.classList.add("mb-1");
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

function addItemToList(item,quantity)
{
    const data = {
        quantity: quantity,
        description: item.name,
        precio: item.price/100,
        total: quantity*item.price/100
    }

    createItemsList([data],"itemList");
    
}

addItemToList(data_B[5],5);