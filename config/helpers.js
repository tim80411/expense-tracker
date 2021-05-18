const exphbs = require('express-handlebars')

const helpers = exphbs.create({
  eq: function (v1, v2) { return v1 === v2},
  css: function(str, option) {
    var cssList = this.cssList || []
    str = str.split(/[,，;；]/)
    console.log('css: ', str)
    str.forEach(item => {
      if (cssList.indexOf(item) < 0) {
        cssList.push(item)
      }
    })
    this.cssList = cssList.concat()
  },
  js: function (str, option) {
    var jsList = this.jsList || []
    str = str.split(/[,，;；]/)
    console.log('css: ', str)
    str.forEach(item => {
      if (jsList.indexOf(item) < 0) {
        jsList.push(item)
      }
    })
    this.jsList = jsList.concat()
  },
})

module.exports = helpers