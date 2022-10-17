//CARRITO
const cart = document.getElementById('cart')
const productsCounter = document.getElementById('counter')
const totalPrice = document.getElementById('price')
let price = 0

async function getCart() {
  const res = await fetch(`/api/carts/${cartId}/products`)
  const data = await res.json()
  return data.cartProducts
}

async function deleteProductFromCart(id, userId, deleteAll = true) {
  if (userId === '') return console.log('not logged')
  const res = await fetch(
    `/api/carts/${userId}/products/${id}?deleteAll=${deleteAll}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  )
  const data = await res.json()
  location.reload()
  return data
}

async function emptyCart(userId) {
  if (userId === '') return console.log('not logged')
  const res = await fetch(`/api/carts/${userId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  const data = await res.json()
  location.reload()
  return data
}
