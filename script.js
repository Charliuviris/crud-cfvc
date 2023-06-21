const carrito = document.getElementById('carrito');
const elementos = document.getElementById('lista-1');
const lista = document.querySelector("#lista-carrito tbody");
const vaciarCarrito = document.getElementById('vaciarCarrito');


cargarEventListeners();

function cargarEventListeners() {
  elementos.addEventListener('click', comprarElemento);
  carrito.addEventListener('click', eliminarElemento);
  vaciarCarrito.addEventListener('click', vaciarCarrito);
}

function comprarElemento(e){
    e.prevetdefault();
    if(e.target.classList.contains('agregar-carrito')){
        const elemento = e.target.parentElement;
        leerDatosElemento(elemento);
    }
}


function leerDatosElemento(elemento) {
    const infoElemento = {
      imagen: elemento.querySelector('img').src,
      titulo: elemento.querySelector('h3').textContent,
      precio: elemento.querySelector('.precio').textContent,
      id: elemento.querySelector('a').getAttribute('data-id')
    }
  
    connection.query(
      `INSERT INTO carrito (imagen, titulo, precio, id) VALUES (?, ?, ?, ?)`,
      [infoElemento.imagen, infoElemento.titulo, infoElemento.precio, infoElemento.id],
      function (err, results, fields) {
        if (err) throw err;
        console.log('Elemento agregado al carrito');
      }
    );
  }


function insertarCarrito(elemento){
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${elemento.imagen}" width=100> 
        </td>
        <td>
            ${elemento.titulo}
        </td>
        <td>
        ${elemento.precio}
        </td>
        <td>
            <a herf="#"="borrar" data-id="${elemento.id}">x</a>
        </td>
    
    `;
    lista.appendChild(row);

}


/*function eliminarElemento(e){ 
    e.prevetdefault();
    let elemento,
        elementoId;
    if(e.target.classList.contains('borrar')){
      e.target.parentElement.parentElement.remove();
      elemento = e.target.parentElement.parentElement;
      elementoId = elemento.querySelector('a').getAttribute('data-id');
    }
}*/

function eliminarElemento(e) {
    e.preventDefault();
    let elementoId;
    if (e.target.classList.contains('borrar')) {
      e.target.parentElement.parentElement.remove();
      elemento = e.target.parentElement.parentElement;
      elementoId = e.target.parentElement.parentElement.querySelector('a').getAttribute('data-id');
  
      connection.query(
        `DELETE FROM carrito WHERE id = ?`,
        [elementoId],
        function (err, results, fields) {
          if (err) throw err;
          console.log('Elemento eliminado del carrito');
        }
      );
    }
  }



function vaciarCarrito() {
    connection.query(
      `DELETE FROM carrito`,
      function (err, results, fields) {
        if (err) throw err;
        console.log('Carrito vaciado');
      }
    );
  
    while (lista.firstChild) {
      lista.removeChild(lista.firstChild);
    }
    return false;
  }