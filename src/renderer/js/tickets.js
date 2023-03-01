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

function crearListaDeObjetos(inputId, objetos) 
{
  // Obtiene el elemento de entrada (INPUT) mediante su ID
  const input = document.getElementById(inputId);

  // Crea un elemento de lista (UL)
  const ul = document.createElement('ul');

  ul.classList.add('bg-white','rounded','py-2','px-0');
  ul.classList.add("position-absolute");
  ul.classList.add('start-0','end-0');

  // Recorre el array de objetos y crea un elemento de lista (LI) para cada objeto
  objetos.forEach(objeto => {
    const li = document.createElement('li');

    li.classList.add("button-c-dark-2");
    li.classList.add('w-100','bg-white','p-3');

    li.textContent = objeto.name;

    ul.appendChild(li);
  });

  // Inserta la lista debajo del elemento de entrada (INPUT)
  input.parentNode.insertBefore(ul, input.nextSibling);
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

crearListaDeObjetos('searchBarInput', data_B);

addItemToList(data_B[5],5);