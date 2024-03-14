var productos = [];

function agregarProductos(id, producto, precio) {
  let indice = productos.findIndex((p) => p.id === id);

  if (indice === -1) {
    postJson({ id: id, producto: producto, precio: precio, cantidad: 1 });
  } else {
    productos[indice].cantidad++;
    putJson(productos[indice]);
  }

  console.log(productos);
  actualizarTabla();
}

function actualizarTabla() {
  let tbody = document.getElementById("tbody");

  let total = 0;
  tbody.innerHTML = "";
  for (let item of productos) {
    if (item.cantidad > 0) {

      let fila = tbody.insertRow();
      let celdaProducto = fila.insertCell(0);
      let celdaCantidad = fila.insertCell(1);
      let celdaPrecio = fila.insertCell(2);
      let celdaTotal = fila.insertCell(3);
      let celdaAcciones = fila.insertCell(4);

      celdaProducto.textContent = item.producto;
      celdaCantidad.textContent = item.cantidad;
      celdaPrecio.textContent = item.precio;
      celdaTotal.textContent = item.cantidad * item.precio;

      let boton = document.createElement("button");
      boton.textContent = "Eliminar";
      celdaAcciones.append(boton);
      boton.className = "btn btn-danger";
      boton.addEventListener("click", function () {

        deleteJson(item.id);
      });

      total = total + item.precio * item.cantidad;
    }
  }
  document.getElementById("total").textContent = total;
}

function postJson(data) {
  let url = "http://localhost:3000/carrito";
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => {
      console.log("Success:", response);
      productos.push(response); 
      actualizarTabla(); 
    });
}


async function getJson() {
  try {
    const response = await fetch("http://localhost:3000/carrito", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log("Success:", result);
    productos = result;
    actualizarTabla();
  } catch (error) {
    console.log("Error", error);
  }
}

window.onload = function () {
  getJson();
};

async function putJson(data) {
  try {
    const response = await fetch(`http://localhost:3000/carrito/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Success", result);

    const index = productos.findIndex((p) => p.id === data.id);
    if (index !== -1) {
      productos[index] = result;
      actualizarTabla();
    }
  } catch (error) {
    console.error("Error", error);
  }
}
async function deleteJson(id) {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro de eliminar?',
      text: 'No se puede revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4EC5F1',
      cancelButtonColor: '#df5373',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    });

    if (result.isConfirmed) {
      const response = await fetch(`http://localhost:3000/carrito/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('Success: ', result);

      const index = productos.findIndex((p) => p.id === id);
      if (index !== -1) {
        if (productos[index].cantidad <= 0) {
          productos.splice(index, 1);
        } else {
          productos[index].cantidad--;
        }
        actualizarTabla();
      }
    }
  } catch (error) {
    console.error('Error: ', error);
  }
}

