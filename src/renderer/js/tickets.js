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
      itemDiv.setAttribute('itemID',item.id);
  
      row.appendChild(itemDiv);
  
      for (const prop in item) 
      {
        const propElement = document.createElement("div");
        propElement.textContent = `${item[prop]}`;
        propElement.style.width = `${Math.floor(100 / numProps)}%`;
        propElement.classList.add("text-center");

        propElement.setAttribute('name',`${prop}`);

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
        total: quantity*item.price/100,
        id: item.id_product
    }

    const exists = searchItemID(item.id_product,"itemList");

    if(!exists)
    {
      createItemsList([data],"itemList");
    }
    else
    {
      const element = document.getElementById('itemSearchList');
      
      const list     = document.getElementById("itemList");
      const row      = list.querySelectorAll('[itemid="'+data.id+'"]');
      const quantity = row[0].querySelectorAll('[name="quantity"]')[0];

      quantity.textContent = parseInt(quantity.textContent)+1;


      if (element) 
      {
        element.remove();
      }
    }
  
}

function crearListaDeObjetos(inputId, objetos) 
{
  // Obtiene el elemento de entrada (INPUT) mediante su ID
  const input = document.getElementById(inputId);

  // Crea un elemento de lista (UL)
  const ul = document.createElement('ul');

  ul.classList.add('bg-white','border','border-secondary-subtle','rounded','py-2','px-0');
  ul.classList.add("position-absolute");
  ul.classList.add('start-0','end-0');

  ul.setAttribute('id',"itemSearchList");

  // Recorre el array de objetos y crea un elemento de lista (LI) para cada objeto
  for(const objeto of objetos)
  {
    const li = document.createElement('li');

    li.classList.add("button-c-dark-2");
    li.classList.add('w-100','bg-white','p-3');

    li.setAttribute('itemID',objeto.id);

    li.textContent = objeto.name;

    li.addEventListener('click',()=>{
      addItemToList(objeto,1);
      
      const element = document.getElementById('itemSearchList');
      if (element) 
      {
        element.remove();
      }

    });

    ul.appendChild(li);
  };

  // Inserta la lista debajo del elemento de entrada (INPUT)
  input.parentNode.insertBefore(ul, input.nextSibling);
}

function filterItemList(text,id) 
{
  const list  = document.getElementById(id);
  const rows  = list.querySelectorAll("li");

  let num = 0;

  for (const row of rows) 
  {
    const object_= data_B[num];
    let rowMatches = false;

    for(const prop in object_)
    {
      if(`${object_[prop]}`.toLowerCase().includes(text.toLowerCase()))
      {
        rowMatches = true;
        break;
      }

    }

    if (rowMatches) 
    {
      row.classList.remove('d-none');
    } 
    else 
    {
      row.classList.add('d-none');
    }
    
    num++;
  }
}

function ticketListeners() 
{
  document.getElementById('searchBarInputMain').addEventListener("focus",function(event){
    const element = document.getElementById('itemSearchList');
    if (!element) 
    {
      crearListaDeObjetos('searchBarInputMain', data_B);
    }
  });
  
  $(document).on("click", function(event) {

    const outItemList  = !$(event.target).closest("#itemSearchList").length;
    const outSearchBar = !$(event.target).closest("#searchBar").length;

    if (outItemList && outSearchBar) {
      // El clic se originó fuera del elemento #itemSearchList
      const element = document.getElementById('itemSearchList');
      if (element) 
      {
        element.remove();
      }

    }
  });
  
  document.getElementById('searchBarInputMain').addEventListener("keyup",function(event){
    filterItemList(this.value,'itemSearchList');
  });
  
}