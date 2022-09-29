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
  if (!ADMIN) alert('no sos admin, cambialo desde el tag scripts en index.html')
  ADMIN &&
    (async () => {
      const post = await fetch(`/api/products/?admin=${ADMIN}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })
      const res = await post.json()
      location.reload()
      return res
    })()
})

const getProducts = async () => {
  const res = await fetch(`/api/products?admin=${ADMIN}`)
  const data = res.json()
  return data
}

getProducts().then(({ products }) => {
  if (products.length)
    for (let product of products)
      productList.innerHTML += generateProductHTML(product)
  else productList.innerHTML = '<p>No hay productos que mostrar.</p>'
})

function deleteProduct(id) {
  ADMIN &&
    (async () => {
      const post = await fetch(`/api/products/${id}?admin=${ADMIN}`, {
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
    const post = await fetch(`/api/carts/${cartId}/products/${id}`, {
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

function generateProductHTML(product) {
  return `
  <li class="product-card">
    <div class="image">
      <img src="${product.photo_url}" alt="foto de ${product.name}"/>
    </div>
    <div class="card-details">
      <span class="code">#${product.code}</span>
      <h2 class="name">${product.name}</h2>
      <div class="stock-details">
        <p class="price">$${product.price}</p>
      </div>
      <span class="add-product-btn" onclick="addProductToCart(${
        product.id
      })">Añadir</span>
      <div class="admin-actions ${ADMIN ? '' : 'disable'}">
        <a href="/pages/updateForm.html?id=${product.id}">
          <button>Actualizar</button>
        </a>
        <button onclick="deleteProduct(${product.id})">Eliminar</button>
      </div>
    </div>
  </li>`
}
