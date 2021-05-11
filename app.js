const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  const lists = [0, 1, 2, 3, 4]
  res.render('index', { lists })
})

app.listen(3000, () => {
  console.log('Express server is running on https://localhost:300')
})