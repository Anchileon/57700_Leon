const productos = {
    1: { nombre: "Echeveria", precio: 1100 },
    2: { nombre: "Crassula", precio: 1200 },
    3: { nombre: "Aloe Vera", precio: 1250 },
    4: { nombre: "Sedum", precio: 1400 },
    5: { nombre: "Haworthia", precio: 2000 },
    6: { nombre: "Kalanchoe", precio: 2200 }
};

const interesFijo6Cuotas = 1.45;

function mostrarProductos() {
    console.log("Productos disponibles:");
    for (const codigo in productos) {
        console.log(`${codigo}: ${productos[codigo].nombre} - Precio: $${productos[codigo].precio}`);
    }
}

function calcularPrecioTotal(productosSeleccionados, cuotas) {
    let total = 0;
    for (const codigo of productosSeleccionados) {
        total += productos[codigo].precio;
    }
    if (cuotas === 6) {
        total *= interesFijo6Cuotas;
    }
    return total;
}

function simularCompra() {
    mostrarProductos();

    const seleccion = prompt("Ingrese los códigos de los productos que desea comprar (separados por coma):");
    const productosSeleccionados = seleccion.split(",").map(codigo => parseInt(codigo));
    const cuotas = parseInt(prompt("Ingrese la cantidad de cuotas (1, 3 o 6):"));

    if (productosSeleccionados.some(codigo => !productos[codigo])) {
        console.log("Uno o más códigos de productos son inválidos.");
        return;
    }

    console.log("Productos seleccionados:");
    let totalProductos = 0;
    for (const codigo of productosSeleccionados) {
        console.log(`${productos[codigo].nombre} - Precio: $${productos[codigo].precio}`);
        totalProductos += productos[codigo].precio;
    }

    const precioTotal = calcularPrecioTotal(productosSeleccionados, cuotas);
    console.log(`\nEl monto total de los productos seleccionados es: $${totalProductos.toFixed(2)}`);
    console.log(`El precio total a pagar es: $${precioTotal.toFixed(2)}`);

    if (cuotas === 6) {
        console.warn(" ¡Atención! Al elegir 6 cuotas se aplica un interés.");
    }

    if (cuotas > 1) {
        console.log("\nDesglose de pagos en cuotas:");
        const montoPorCuota = precioTotal / cuotas;
        for (let i = 1; i <= cuotas; i++) {
            console.log(`Cuota ${i}: $${montoPorCuota.toFixed(2)}`);
        }
    }
}
