const productos = [
    { codigo: 1, nombre: "Echeveria", precio: 1100 },
    { codigo: 2, nombre: "Crassula", precio: 1200 },
    { codigo: 3, nombre: "Aloe Vera", precio: 1250 },
    { codigo: 4, nombre: "Sedum", precio: 1400 },
    { codigo: 5, nombre: "Haworthia", precio: 2000 },
    { codigo: 6, nombre: "Kalanchoe", precio: 2200 }
];

const interesFijoSeisCuotas = 1.45;

// Cargar carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Elementos del DOM
const productList = document.querySelector('#product-list');
const cartList = document.querySelector('#cart-list');
const totalPriceElement = document.querySelector('#total-price');
const paymentPlanElement = document.querySelector('#payment-plan');
const clearCartButton = document.querySelector('#clear-cart');
const purchaseButton = document.querySelector('#purchase');
const cuotasSelect = document.querySelector('#cuotas');
const interestWarning = document.querySelector('#interest-warning');

// Función para buscar un producto por su código
const buscarProducto = codigo => productos.find(producto => producto.codigo === codigo);

// Función para mostrar productos en el DOM
const mostrarProductos = () => {
    productList.innerHTML = '';
    productos.forEach(producto => {
        const productCard = document.createElement('div');
        productCard.className = 'plant-card';
        productCard.innerHTML = `
            <img src="./assets/img/${producto.nombre.toLowerCase().replace(' ', '')}.jpg" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <button onclick="agregarAlCarrito(${producto.codigo})">Agregar al carrito</button>
        `;
        productList.appendChild(productCard);
    });
}

// Función para agregar un producto al carrito y actualizar localStorage
const agregarAlCarrito = codigo => {
    const producto = buscarProducto(codigo);
    if (producto) {
        carrito.push(producto);
        actualizarCarrito();
    }
}

// Función para mostrar el contenido del carrito en el DOM
const mostrarCarrito = () => {
    cartList.innerHTML = '';
    if (carrito.length === 0) {
        cartList.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }
    carrito.forEach((producto, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <p>${producto.nombre} - Precio: $${producto.precio}</p>
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        cartList.appendChild(cartItem);
    });
}

// Función para eliminar un producto del carrito y actualizar localStorage
const eliminarDelCarrito = indice => {
    if (indice >= 0 && indice < carrito.length) {
        carrito.splice(indice, 1);
        actualizarCarrito();
    }
}

// Función para calcular el precio total del carrito sin cuotas
const calcularPrecioTotalSinCuotas = () => carrito.reduce((suma, producto) => suma + producto.precio, 0);

// Función para actualizar el total del carrito en tiempo real
const actualizarTotalCarrito = () => {
    const total = calcularPrecioTotalSinCuotas();
    totalPriceElement.innerHTML = `Total: $${total.toFixed(2)}`;
}

// Función para actualizar el carrito en localStorage y en el DOM
const actualizarCarrito = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    actualizarTotalCarrito(); // Actualiza el total cuando se modifica el carrito
}

// Función para finalizar la compra
const finalizarCompra = (total, cuotas) => {
    const montoPorCuota = total / cuotas;
    paymentPlanElement.innerHTML = `
        <h3>¡Gracias por tu compra!</h3>
        <p>Total a pagar: $${total.toFixed(2)}</p>
        <h4>Desglose de pagos en ${cuotas} cuotas:</h4>
        ${Array.from({ length: cuotas }, (_, i) => `<p>Cuota ${i + 1}: $${montoPorCuota.toFixed(2)}</p>`).join('')}
        <button id="restart-purchase">Iniciar nueva compra</button>
    `;

    document.querySelector('#restart-purchase').addEventListener('click', () => {
        carrito = [];
        actualizarCarrito();
        totalPriceElement.innerHTML = '';
        paymentPlanElement.innerHTML = '';
        mostrarProductos();
        interestWarning.classList.add('hidden'); // Oculta el mensaje de advertencia
    });
}

// Evento para manejar la compra
purchaseButton.addEventListener('click', () => {
    const cuotas = parseInt(cuotasSelect.value);
    const total = calcularPrecioTotalSinCuotas();
    const totalPrice = cuotas === 6 ? total * interesFijoSeisCuotas : total;
    totalPriceElement.innerHTML = `Total: $${totalPrice.toFixed(2)}`;
    finalizarCompra(totalPrice, cuotas);
});

// Evento para vaciar el carrito
clearCartButton.addEventListener('click', () => {
    carrito = [];
    actualizarCarrito();
    totalPriceElement.innerHTML = '';
    paymentPlanElement.innerHTML = '';
    interestWarning.classList.add('hidden'); // Oculta el mensaje de advertencia
});

// Evento para mostrar advertencia de interés al seleccionar 6 cuotas
cuotasSelect.addEventListener('change', () => {
    if (parseInt(cuotasSelect.value) === 6) {
        interestWarning.innerHTML = 'Seleccionaste 6 cuotas. Esta opción tiene intereses.';
        interestWarning.classList.remove('hidden');
    } else {
        interestWarning.classList.add('hidden');
    }
});

// Inicialización
mostrarProductos();
actualizarCarrito();
