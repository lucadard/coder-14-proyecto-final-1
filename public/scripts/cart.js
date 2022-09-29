//CARRITO
const cart = document.getElementById('cart')
const productsCounter = document.getElementById('counter')
const totalPrice = document.getElementById('price')
let price = 0

const getCart = async () => {
  const res = await fetch(`/api/carts/${cartId}/products`)
  const data = await res.json()
  return data.cartProducts
}

getCart().then((products) => {
  if (products.length) {
    productsCounter.innerHTML = products.length
    for (let product of products) {
      cart.innerHTML += generateCartItemHTML(product)
      price += +product.data.price * +product.amount
      totalPrice.innerHTML = price
    }
  } else cart.innerHTML = '<p>No hay productos que mostrar.</p>'
})

function deleteProductFromCart(id, deleteAll = true) {
  ;(async () => {
    const post = await fetch(
      `/api/carts/${cartId}/products/${id}?deleteAll=${deleteAll}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    const res = await post.json()
    location.reload()
    return res
  })()
}

function emptyCart(id) {
  ;(async () => {
    const post = await fetch(`/api/carts/${id}`, {
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

function generateCartItemHTML({ data, amount }) {
  return `
  <li class="product-card">
    <div class="product-left">
      <div class="product-details">
        <div class="image">
          <img src="${data.photo_url}" alt="foto de ${data.name}"/>
        </div>
        <h2 class="name">${data.name}</h2>
      </div>
      <p class="delete-product-btn" onclick="deleteProductFromCart(${
        data.id
      })">Eliminar</p>
    </div>
    <div class="stock-details">
      <div class="amount">
      <span onclick=deleteProductFromCart(${data.id},false)>-</span>
        <p>${amount}</p>
      <span onclick=addProductToCart(${data.id})>+</span>
      </div>
      <p class="stock">${data.stock} disponibles</p>
    </div>
    <div class="price">
      <p>$${data.price * amount}</p>
    </div>
  </li>`
}
