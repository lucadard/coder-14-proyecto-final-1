const productUpdateForm = document.getElementById('productUpdateForm')
const errorMsg = document.getElementById('errorMsg')
const id = location.search.slice(4)

productUpdateForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const form = {}
  const inputArray = [...productUpdateForm.querySelectorAll('input')]
  inputArray.map((input) => {
    form[input.name] = input.value
  })
  updateProduct(id, form, ({ error, data }) => {
    if (error) {
      productUpdateForm.reset()
      errorMsg.classList.add('show')
    } else location.reload()
  })
})

async function updateProduct(id, newData, callback) {
  const post = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newData)
  })
  const res = await post.json()
  return callback(res)
}
