const productForm = document.getElementById('productForm')
const errorMsg = document.getElementById('errorMsg')

productForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const form = {}
  const inputArray = [...productForm.querySelectorAll('input')]
  inputArray.map((input) => {
    form[input.name] = input.value
  })
  productForm.reset()
  sendProduct(form, ({ error, data }) => {
    if (error) {
      productForm.reset()
      errorMsg.classList.add('show')
    } else location.assign('/')
  })
})

async function sendProduct(product, callback) {
  const res = await fetch(`/api/products`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  })
  const data = await res.json()
  return callback(data)
}
