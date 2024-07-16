
const interesFijoSeisCuotas = 1.45;

let productos = [];

fetch('https://66873cf80bc7155dc017071a.mockapi.io/articles')
.then(response => response.json())
.then(data => {
    productos = data;
    mostrarProductos();
})
.catch(error => console.error('Error fetching products:', error));

// Cargar carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Elementos del DOM
const productList = document.querySelector('#lista-producto');
const cartList = document.querySelector('#lista-carrito');
const totalPriceElement = document.querySelector('#precio-total');
const paymentPlanElement = document.querySelector('#plan-pagos');
const clearCartButton = document.querySelector('#limpiar-carrito');
const purchaseButton = document.querySelector('#comprar');
const cuotasSelect = document.querySelector('#cuotas');
const interestWarning = document.querySelector('#interes-warn');

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
        // Notificar con SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: `${producto.nombre} ha sido agregado al carrito.`,
            showConfirmButton: false,
            timer: 1500
        });
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
    interestWarning.classList.add('hidden');
});

// Evento para mostrar advertencia de interés al seleccionar 6 cuotas
purchaseButton.addEventListener('click', () => {
    const cuotas = parseInt(cuotasSelect.value);
    const total = calcularPrecioTotalSinCuotas();
    if (cuotas === 6) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: `Al seleccionar 6 cuotas, se aplicará un interés fijo del ${interesFijoSeisCuotas}% al total de la compra.`,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.isConfirmed) {
                finalizarCompra(total, cuotas);
            }
        });
    } else {
        finalizarCompra(total, cuotas);
    }
});



// Inicialización
mostrarProductos();
actualizarCarrito();
