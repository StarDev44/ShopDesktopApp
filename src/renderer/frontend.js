// Cargamos la pantalla Principal
console.log($("#contentGUI").load("./screens/main.html"));

document.getElementById("minWinButton").addEventListener("click", function (e) {
     window.electronAPI.minimize()
});

document.getElementById("maxWinButton").addEventListener("click", function (e) {
     window.electronAPI.maximize()
});

document.getElementById("closeWinButton").addEventListener("click", function (e) {

     window.close();
});

// Botones SideBar

const sidebarBtns = 
{
     cashbox:    document.getElementById("buttonCashBox"),
     clients:    document.getElementById("buttonClients"),
     config:     document.getElementById("buttonConfig"),
     sales:      document.getElementById("buttonSales"),
     inventory:  document.getElementById("buttonInv")
}

sidebarBtns.sales.addEventListener("click",()=>{

     $("#contentGUI").load("./screens/main.html");

});


sidebarBtns.inventory.addEventListener("click",()=>{

     $("#contentGUI").load("./screens/inventory.html");

});



//This function read the data 
//of a JSON and print at a DIV with
// id="productList" a list of the each
//data

function createList(data, id, columns = 1) 
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

  function searchItemID(itemID,idBox) 
  {
     const list  = document.getElementById(idBox);
     const rows  = list.querySelectorAll('[itemid="'+itemID+'"]');

     if(rows.length > 0)
     {
          return true;
     }

     return false;
     
  }