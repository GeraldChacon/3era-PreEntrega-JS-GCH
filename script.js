let listaProductos = [
    { id: 1, nombre: "Royal Canin Mini", categoria: "alimentos", stock: 20, precio: 50, rutaImagen: "royalcanin-mini.png" },
    { id: 2, nombre: "Proplan Active Mind", categoria: "alimentos", stock: 30, precio: 100, rutaImagen: "proplan-activemind.png" },
    { id: 3, nombre: "Proplan Adulto", categoria: "alimentos", stock: 20, precio: 110, rutaImagen: "proplan-adult.png" },
    { id: 4, nombre: "Royal Canin Puppy", categoria: "alimentos", stock: 14, precio: 60, rutaImagen: "royalcanin-mini-puppy.png" },
    { id: 5, nombre: "Peine", categoria: "higiene", stock: 10, precio: 5, rutaImagen: "peine-perro.png" },
    { id: 6, nombre: "Corta Uñas y Lima", categoria: "higiene", stock: 18, precio: 35, rutaImagen: "corta-una-lima.png" },
    { id: 7, nombre: "Pelotas", categoria: "juguetes", stock: 10, precio: 15, rutaImagen: "pelotas-perro.png" },
    { id: 8, nombre: "Piloto", categoria: "higiene", stock: 18, precio: 25, rutaImagen: "piloto-perro2.png" },
]

const obtenerCarritoLS = () => JSON.parse(localStorage.getItem("carrito")) || []

principal(listaProductos)

function principal(productos) {
    renderizarCarrito()

    let botonBuscar = document.getElementById("botonBuscar")
    botonBuscar.addEventListener("click", () => filtrarYRenderizar(productos))

    let inputBusqueda = document.getElementById("inputBusqueda")
    inputBusqueda.addEventListener("keypress", (e) => filtrarYRenderizarEnter(productos, e))

    let botonVerOcultar = document.getElementById("botonVerOcultar")
    botonVerOcultar.addEventListener("click", verOcultar)

    renderizarProductos(productos)

    let botonComprar = document.getElementById("botonComprar")
    botonComprar.addEventListener("click", finalizarCompra)

    let botonesFiltros = document.getElementsByClassName("botonFiltro")
    for (const botonFiltro of botonesFiltros) {
        botonFiltro.addEventListener("click", (e) => filtrarYRenderizarProductosPorCategoria(e, productos))
    }
}

function filtrarYRenderizarProductosPorCategoria(e, productos) {
    let value = e.target.value
    let productosFiltrados = productos.filter(producto => producto.categoria === value)
    renderizarProductos(productosFiltrados.length > 0 ? productosFiltrados : productos)
}

function verOcultar(e) {
    let contenedorCarrito = document.getElementById("contenedorCarrito")
    let contenedorProductos = document.getElementById("contenedorProductos")

    contenedorCarrito.classList.toggle("oculto")
    contenedorProductos.classList.toggle("oculto")

    e.target.innerText = e?.target?.innerText === "Ver Carrito" ? "Ver Productos" : "Ver Carrito"
}

function finalizarCompra() {
    localStorage.removeItem("carrito")
    renderizarCarrito([])
    Swal.fire({
        title: "Kenzo Pet Shop",
        text: "Te agradece por elegirnos",
        icon: "success",
        showConfirmButton: false,
        timer: 4000,
      });
}

function filtrarYRenderizarEnter(productos, e) {
    e.keyCode === 13 && renderizarProductos(filtrarProductos(productos))
}

function filtrarYRenderizar(productos) {
    let productosFiltrados = filtrarProductos(productos)
    renderizarProductos(productosFiltrados)
}

function filtrarProductos(productos) {
    let inputBusqueda = document.getElementById("inputBusqueda")
    return productos.filter(producto => producto.nombre.includes(inputBusqueda.value) || producto.categoria.includes(inputBusqueda.value))
}

function renderizarProductos(productos) {
    let contenedorProductos = document.getElementById("contenedorProductos")
    contenedorProductos.innerHTML = ""

    productos.forEach(({ nombre, rutaImagen, precio, stock, id }) => {
        let tarjetaProducto = document.createElement("div")

        tarjetaProducto.innerHTML = `
            <h4>${nombre}</h4>
            <img src=./images/${rutaImagen} />
            <h5>Precio: ${precio}</h5>
            <p>Stock: ${stock || "Sin unidades"}</p>
            <button class=bC id=botonCarrito${id}>Agregar al carrito</button>

        `

        contenedorProductos.appendChild(tarjetaProducto)

        let botonAgregarAlCarrito = document.getElementById("botonCarrito" + id)
        botonAgregarAlCarrito.addEventListener("click", (e) => agregarProductoAlCarrito(e, productos))
    })
}

function agregarProductoAlCarrito(e, productos) {
    let carrito = obtenerCarritoLS()
    let idDelProducto = Number(e.target.id.substring(12))
    let posProductoEnCarrito = carrito.findIndex(producto => producto.id === idDelProducto)
    let productoBuscado = productos.find(producto => producto.id === idDelProducto)

    ejecutarTostada("Se agrego producto", 1500)

    if (posProductoEnCarrito !== -1) {
        carrito[posProductoEnCarrito].unidades++
        carrito[posProductoEnCarrito].subtotal = carrito[posProductoEnCarrito].precioUnitario * carrito[posProductoEnCarrito].unidades
    } else {
        carrito.push({
            id: productoBuscado.id,
            nombre: productoBuscado.nombre,
            precioUnitario: productoBuscado.precio,
            unidades: 1,
            subtotal: productoBuscado.precio
        })
    }

    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito()
}

function renderizarCarrito() {
    let carrito = obtenerCarritoLS()
    let contenedorCarrito = document.getElementById("contenedorCarrito")
    contenedorCarrito.innerHTML = ""
    carrito.forEach(producto => {
        let tarjetaProductoCarrito = document.createElement("div")
        tarjetaProductoCarrito.className = "tarjetaProductoCarrito"

        tarjetaProductoCarrito.innerHTML = `
            <p>${producto.nombre}</p>
            <p>${producto.precioUnitario}</p>
            <div class=unidades>
                <button class= masMenos id=dec${producto.id}>-</button>
                <p>${producto.unidades}</p>
                <button class= masMenos id=inc${producto.id}>+</button>
            </div>
            <p>${producto.subtotal}</p>
            <button class="delet" id=eliminar${producto.id}>Eliminar</button>
        `
        contenedorCarrito.appendChild(tarjetaProductoCarrito)

        let botonDecUnidad = document.getElementById("dec" + producto.id)
        botonDecUnidad.addEventListener("click", decrementarUnidad)

        let botonIncUnidad = document.getElementById("inc" + producto.id)
        botonIncUnidad.addEventListener("click", incrementarUnidad)

        let botonEliminar = document.getElementById("eliminar" + producto.id)
        botonEliminar.addEventListener("click", eliminarProductoDelCarrito)
    })
}

function decrementarUnidad(e) {
    let carrito = obtenerCarritoLS()
    let id = Number(e.target.id.substring(3))
    let posProdEnCarrito = carrito.findIndex(producto => producto.id === id)

    carrito[posProdEnCarrito].unidades--
    carrito[posProdEnCarrito].subtotal = carrito[posProdEnCarrito].unidades * carrito[posProdEnCarrito].precioUnitario
    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito()

}

function incrementarUnidad(e) {
    let carrito = obtenerCarritoLS()
    let id = Number(e.target.id.substring(3))
    let posProdEnCarrito = carrito.findIndex(producto => producto.id === id)

    carrito[posProdEnCarrito].unidades++
    carrito[posProdEnCarrito].subtotal = carrito[posProdEnCarrito].unidades * carrito[posProdEnCarrito].precioUnitario
    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito()

}

function eliminarProductoDelCarrito(e) {
    let carrito = obtenerCarritoLS()
    let id = Number(e.target.id.substring(8))
    carrito = carrito.filter(producto => producto.id !== id)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    e.target.parentElement.remove()
}

function ejecutarTostada(text, duration) {
    Toastify({
        text,
        duration,
        className: "tostada"
    }).showToast();
}