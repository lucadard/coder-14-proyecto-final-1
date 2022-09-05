const ADMIN = true
const cartId = '1'

//PRODUCTOS
const productForm = document.getElementById('productForm')
const productList = document.getElementById('productList')

productForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const form = {}
  const inputArray = [...productForm.querySelectorAll('input')]
  inputArray.map((input) => {
    form[input.name] = input.value
  })
  ADMIN &&
    (async () => {
      const post = await fetch(`/api/productos/?admin=${ADMIN}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })
      const res = await post.json()
      location.reload()
    })()
})

const getProducts = async () => {
  const res = await fetch(`/api/productos?admin=${ADMIN}`)
  const data = res.json()
  return data
}

getProducts().then(({ products }) => {
  if (products.length)
    for (let product of products)
      productList.innerHTML += generateProductHTML(product)
  else productList.innerHTML = '<p>No hay productos que mostrar.</p>'
})

function generateProductHTML(product) {
  return `
  <li class="product-card">
    <div class="image">
      <img src="${product.foto}" alt="foto de ${product.nombre}"/>
    </div>
    <div class="card-details">
      <span class="code">#${product.codigo}</span>
      <h2 class="name">${product.nombre}</h2>
      <div class="stock-details">
        <p class="price">$${product.precio}</p>
      </div>
      <span class="add-product-btn" onclick="addProductToCart(${product.id})">Añadir</span>
      <div class="admin-actions ${ADMIN ? '' : 'disable'}">
        <button onclick="updateProduct(${product.id})">Actualizar</button>
        <button onclick="deleteProduct(${product.id})">Eliminar</button>
      </div>
    </div>
  </li>`
}

function updateProduct(id) {
  console.log('update' + id)
}

function deleteProduct(id) {
  ADMIN &&
    (async () => {
      const post = await fetch(`/api/productos/${id}?admin=${ADMIN}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      const res = await post.json()
      location.reload()
      return res
    })()
}

function addProductToCart(id) {
  ;(async () => {
    const post = await fetch(`/api/carrito/${cartId}/productos/${id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const res = await post.json()
    location.reload()
    return res
  })()
}
function deleteProductFromCart(id) {
  ;(async () => {
    const post = await fetch(`/api/carrito/${cartId}/productos/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const res = await post.json()
    location.reload()
    return res
  })()
}

//CARRITO
const cart = document.getElementById('cart')

// const createCart = async () => {
//   const post = await fetch(`/api/carrito`, {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json'
//     }
//   })
//   const { id } = await post.json()
//   console.log(id)
//   return id
// }

const getCart = async () => {
  const res = await fetch(`/api/carrito/${cartId}/productos`)
  const data = res.json()
  return data
}

getCart().then(({ products }) => {
  if (products.length)
    for (let product of products)
      cart.innerHTML += generateCartItemHTML(product)
  else cart.innerHTML = '<p>No hay productos que mostrar.</p>'
})

function generateCartItemHTML(product) {
  return `<li class="product-card">
    <div class="product-upper">
        <span class="code">#${product.codigo}</span>
        <h4 class="name">${product.nombre}</h4>
        <img class="image" src="${product.foto}" alt="foto de ${product.nombre}"/>
    </div>
    <p class="price">$${product.precio}</p>
    <div class="actions">
      <button onclick="deleteProductFromCart(${product.id})">Eliminar</button>
    </div>
    </li>`
}
