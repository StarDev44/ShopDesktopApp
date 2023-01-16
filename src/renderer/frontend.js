
// window.addEventListener('load', () => {
//   document.getElementById('mensaje').innerHTML = 'Este es un mensaje de JS'
// })

document.getElementById("minWinButton").addEventListener("click", function (e) {
     window.electronAPI.minimize()
});

document.getElementById("maxWinButton").addEventListener("click", function (e) {
     window.electronAPI.maximize()
});

document.getElementById("closeWinButton").addEventListener("click", function (e) {

     window.close();
});