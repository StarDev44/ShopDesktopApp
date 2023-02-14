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