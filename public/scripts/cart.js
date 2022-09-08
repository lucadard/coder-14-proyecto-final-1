//CARRITO
const cart = document.getElementById('cart')

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

function deleteProductFromCart(id, deleteAll = true) {
  ;(async () => {
    const post = await fetch(
      `/api/carrito/${cartId}/productos/${id}?deleteAll=${deleteAll}`,
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

function generateCartItemHTML({ producto, cantidad }) {
  return `
  <li class="product-card">
    <div class="product-left">
      <div class="product-details">
        <div class="image">
          <img src="${producto.foto}" alt="foto de ${producto.nombre}"/>
        </div>
        <h2 class="name">${producto.nombre}</h2>
      </div>
      <p class="delete-product-btn" onclick="deleteProductFromCart(${
        producto.id
      })">Eliminar</p>
    </div>
    <div class="stock-details">
      <div class="amount">
      <span onclick=deleteProductFromCart(${producto.id},false)>-</span>
        <p>${cantidad}</p>
      <span onclick=addProductToCart(${producto.id})>+</span>
      </div>
      <p class="stock">${producto.stock} disponibles</p>
    </div>
    <div class="price">
      <p>$${producto.precio * cantidad}</p>
    </div>
  </li>`
}
