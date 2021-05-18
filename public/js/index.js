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
