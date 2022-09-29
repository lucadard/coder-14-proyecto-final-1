//EDITAR PRODUCTO
const productUpdateForm = document.getElementById('productUpdateForm')
const id = location.search.slice(location.search.length - 1)

productUpdateForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const form = {}
  const inputArray = [...productUpdateForm.querySelectorAll('input')]
  inputArray.map((input) => {
    form[input.name] = input.value
  })
  ADMIN &&
    (async () => {
      const post = await fetch(`/api/products/${id}?admin=${ADMIN}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })
      const res = await post.json()
      window.location.replace('/')
      return res
    })()
})
