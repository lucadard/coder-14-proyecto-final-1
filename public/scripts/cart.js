//CARRITO
async function deleteProductFromCart(id, userId, deleteAll = true) {
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

const purchaseBtn = document.getElementById('purchaseBtn')
const closeBtn = document.getElementById('closeBtn')
const purchaseInfo = document.getElementById('purchaseInfo')
async function purchase(userId) {
  purchaseBtn.innerHTML = '⭕️'
  purchaseBtn.classList.add('noBg')
  const res = await fetch(`/api/purchase/${userId}`)
  const data = await res.json()
  purchaseBtn.innerHTML = !data.error ? '✔️' : '❌'
  purchaseInfo.innerHTML = !data.error
    ? 'Tu pedido fue enviado!'
    : 'Error, vuelve a intentarlo.'
  closeBtn.innerHTML = 'Volver'
  purchaseBtn.onclick = () => {}
  closeBtn.onclick = () => location.reload()
  return data
}

const popup = document.getElementById('popup')
function togglePopup() {
  if (popup.classList.contains('hide')) popup.classList.remove('hide')
  else popup.classList.add('hide')
}
