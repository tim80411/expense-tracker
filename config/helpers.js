const exphbs = require('express-handlebars')

const helpers = exphbs.create({
  eq: function (v1, v2) { return v1 === v2}
})

module.exports = helpers