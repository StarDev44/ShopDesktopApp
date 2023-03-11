const data_B        = window.electronAPI.getProductsDB();

let actualTicketIndex = 0;

let mainTicketData  = [];

const emptyTicket = {
  items: [],
  date: Date.now(),
  id: "",
  client: "",
  billInfo: "",
  description: ""
}

mainTicketData.push(emptyTicket);

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

function createItemsList(data, id, columns = 1,itemID=null) 
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
      itemDiv.classList.add("p-1");
      itemDiv.classList.add("mb-1");
      itemDiv.classList.add("d-flex");
      itemDiv.classList.add("button-c-dark");
      itemDiv.classList.add("align-items-center");
      itemDiv.setAttribute('itemID',itemID);
  
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
    let finalQuantity = 1;

    const data = {
        quantity: quantity,
        description: item.name,
        price: item.price/100,
        total: quantity*item.price/100,
    }

    const exists = searchItemID(item.id_product,"itemList");

    if(!exists)
    {
      createItemsList([data],"itemList",1,item.id_product);
    }
    else
    {
      const element = document.getElementById('itemSearchList');
      
      const list     = document.getElementById("itemList");
      const row      = list.querySelectorAll('[itemid="'+item.id_product+'"]');
      const quantity = row[0].querySelectorAll('[name="quantity"]')[0];
      const total    = row[0].querySelectorAll('[name="total"]')[0];

      finalQuantity        = parseInt(quantity.textContent)+1;
      quantity.textContent = finalQuantity;
      total.textContent    = parseFloat(total.textContent)+data.price;


      if (element) 
      {
        element.remove();
      }
      
    }

    let dataFound = false;

    for (let dat of mainTicketData[actualTicketIndex].items) 
    {
      if(dat.id == item.id_product)
      {
        dat.quantity = finalQuantity;
        dataFound = true;
        break;
      }
      
    }

    if(!dataFound)
    {
      mainTicketData[actualTicketIndex].items.push(
      {
        quantity: finalQuantity,
        id: item.id_product
      });
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
    li.classList.add('w-100','bg-white','p-1');

    li.setAttribute('itemID',objeto.id);

    li.textContent = objeto.name;

    li.addEventListener('click',()=>{
      addItemToList(objeto,1);
      
      const element = document.getElementById('itemSearchList');
      if (element) 
      {
        element.remove();
      }

      //Aquí sumamos los valores de la lista

      const list     = document.getElementById("itemList");
      const row      = list.querySelectorAll('.row');
      let summary    = 0;
      
      for(const ob of row)
      {
        const total    = ob.querySelectorAll('[name="total"]')[0];
        summary       += parseFloat(total.textContent);
      }
      
      document.getElementById("priceSummary").textContent = Math.round(summary*100)/100;
      document.getElementById("ivaSummary").textContent   = Math.round(summary*0.12*100)/100;
      document.getElementById("totalSummary").textContent = Math.round(summary*1.12*100)/100;
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

  document.getElementById('modalSaveButton').addEventListener("click",()=>{
    addTicketToList({
      items: [],
      date: Date.now(),
      id: "",
      title: $("#ticketCFTitle").val(),
      client: "Consumidor Final",
      billInfo: "",
      description: $("#ticketCFDescription").val()
    });
    
  });
  
}

function addTicketToList(ticketInfo,containerID="ticketList")
{
  // Crear el elemento contenedor
  let contenedor = document.createElement("div");
  contenedor.classList.add("d-flex", "flex-column", "mb-1", "position-relative");

  // Crear el elemento principal
  let elementoPrincipal = document.createElement("div");
  elementoPrincipal.classList.add("button-c-dark", "d-flex", "flex-column")
  elementoPrincipal.classList.add( "justify-content-center", "align-items-center")
  elementoPrincipal.classList.add( "bg-yellow-100", "border-2", "border-warning")
  elementoPrincipal.classList.add( "border-start-0", "p-2");

  // Crear el elemento interno
  let elementoInterno = document.createElement("div");
  elementoInterno.classList.add("d-flex", "flex-row", "w-100");

  let elementoInternoInterno = document.createElement("div");
  elementoInternoInterno.classList.add("d-flex", "flex-column", "border-secondary")
  elementoInternoInterno.classList.add( "border-2", "rounded", "ms-1", "px-2", "py-1", "w-100");

  let spanNombre = document.createElement("span");
  spanNombre.classList.add("w-100", "text-left");
  spanNombre.textContent = ticketInfo.title;

  let hr = document.createElement("hr");
  hr.classList.add("mt-0", "mb-2");

  let spanCategoria = document.createElement("span");
  spanCategoria.classList.add("w-100", "text-start");
  spanCategoria.textContent = ticketInfo.client;

  let spanDescripcion = document.createElement("span");
  spanDescripcion.classList.add("w-100", "fw-light", "fs-6", "text-secondary", "text-start");
  spanDescripcion.textContent = ticketInfo.description;

  elementoInternoInterno.appendChild(spanNombre);
  elementoInternoInterno.appendChild(hr);
  elementoInternoInterno.appendChild(spanCategoria);
  elementoInternoInterno.appendChild(spanDescripcion);

  elementoInterno.appendChild(elementoInternoInterno);

  elementoPrincipal.appendChild(elementoInterno);

  // Crear el botón "Cobrar"
  let botonCobrar = document.createElement("button");
  botonCobrar.classList.add("button-c-bright", "bg-success");
  botonCobrar.classList.add("text-white", "fw-bold", "rounded-bottom", "py-0");
  botonCobrar.innerHTML = "Cobrar";

  // Crear el botón "Cerrar"
  let botonCerrar = document.createElement("button");
  botonCerrar.classList.add("button-c-bright", "position-absolute", "top-50")
  botonCerrar.classList.add("start-100", "translate-middle", "h-100")
  botonCerrar.classList.add("bg-danger", "ms-1", "rounded-end");

  botonCerrar.innerHTML = `
  <svg class="bi m-0 h-100 text-white" id="closeWinButton" width="20" height="20" fill="currentColor">
    <use xlink:href="./img/bootstrap-icons.svg#x" />
  </svg>`;
  
  // Crear el elemento circular
  let elementoCircular = document.createElement("div");
  elementoCircular.classList.add("position-absolute", "top-C40", "start-0")
  elementoCircular.classList.add("translate-middle", "bg-light", "rounded-circle", "p-2");

  // Agregar los elementos creados al contenedor
  contenedor.appendChild(elementoPrincipal);
  contenedor.appendChild(botonCobrar);
  contenedor.appendChild(botonCerrar);
  contenedor.appendChild(elementoCircular);
  
  // Agregar el contenedor al elemento del DOM especificado por su ID
  let contenedorPadre = document.getElementById(containerID);
  contenedorPadre.appendChild(contenedor);
}

let nnn =0;
function updateMssDebug() 
{
  $("#debugMss").text(Date.now());
  nnn++;
}

setInterval(() => {
  updateMssDebug();
}, 2000 );

