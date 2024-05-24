const productos = [
    { codigo: 1, nombre: "Echeveria", precio: 1100 },
    { codigo: 2, nombre: "Crassula", precio: 1200 },
    { codigo: 3, nombre: "Aloe Vera", precio: 1250 },
    { codigo: 4, nombre: "Sedum", precio: 1400 },
    { codigo: 5, nombre: "Haworthia", precio: 2000 },
    { codigo: 6, nombre: "Kalanchoe", precio: 2200 }
];

const interesFijoSeisCuotas = 1.45;

let carrito = [];

// Función para buscar un producto por su código
const buscarProducto = (codigo) => productos.find(producto => producto.codigo === codigo);

// Función para mostrar productos
function mostrarProductos() {
    console.log("Productos disponibles:");
    productos.forEach(producto => {
        console.log(`${producto.codigo}: ${producto.nombre} - Precio: $${producto.precio}`);
    });
}

// Función para agregar un producto al carrito
function agregarAlCarrito(codigo) {
    const producto = buscarProducto(codigo);
    if (producto) {
        carrito.push(producto);
        console.log(`Producto ${producto.nombre} agregado al carrito.`);
    } else {
        console.error("Código de producto inválido.");
    }
}

// Función para mostrar el contenido del carrito
function mostrarCarrito() {
    if (carrito.length === 0) {
        console.log("El carrito está vacío.");
        return;
    }
    console.log("Carrito de compras:");
    carrito.forEach((producto, index) => {
        console.log(`${index + 1}. ${producto.nombre} - Precio: $${producto.precio}`);
    });
}

// Función para eliminar un producto
function eliminarDelCarrito(indice) {
    if (indice >= 0 && indice < carrito.length) {
        const productoEliminado = carrito.splice(indice, 1)[0];
        console.log(`Producto ${productoEliminado.nombre} eliminado del carrito.`);
    } else {
        console.error("Índice de producto inválido.");
    }
}

// Función para calcular el precio total del carrito
function calcularPrecioTotal(cuotas) {
    const total = carrito.reduce((suma, producto) => suma + producto.precio, 0);
    return cuotas === 6 ? total * interesFijoSeisCuotas : total;
}

// Función principal
function simularCompra() {
    let seguirComprando = true;

    while (seguirComprando) {
        mostrarProductos();
        const seleccion = prompt("Ingrese el código del producto que desea agregar al carrito:");
        agregarAlCarrito(parseInt(seleccion));
        mostrarCarrito();

        seguirComprando = confirm("¿Desea agregar más productos al carrito?");
    }

    if (carrito.length === 0) {
        console.error("El carrito está vacío. No se puede proceder con la compra.");
        return;
    }

    const cuotas = parseInt(prompt("Ingrese la cantidad de cuotas (1, 3 o 6):"));
    const precioTotal = calcularPrecioTotal(cuotas);

    console.log(`\nEl monto total de los productos seleccionados es: $${precioTotal.toFixed(2)}`);
    
    if (cuotas === 6) {
        console.warn("¡Atención! Al elegir 6 cuotas se aplica un interés.");
    }

    if (cuotas > 1) {
        console.log("\nDesglose de pagos en cuotas:");
        const montoPorCuota = precioTotal / cuotas;
        for (let i = 1; i <= cuotas; i++) {
            console.log(`Cuota ${i}: $${montoPorCuota.toFixed(2)}`);
        }
    }
}

simularCompra();
