//CARRITO
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
