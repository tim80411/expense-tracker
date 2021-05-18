const form = document.querySelector('.needs-validation')
const amounts = document.querySelectorAll('.amount')
const totalPrice = document.querySelector('.total-price')

let total = 0

function displayTotal() {
  amounts.forEach(amount => {
    total += Number(amount.innerText)
  })

  totalPrice.innerText = total
}

displayTotal()


form.addEventListener('submit', function (event) {
  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }

  form.classList.add('was-validated')
})