const bcrypt = require('bcryptjs')

const User = require('../User')

const db = require('../../config/mongoose')

const users = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '111'
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '222'
  },
]

db.on('open', () => {
  return Promise.all(Array.from(users, user => {
    const { name, email, password } = user
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => {
        return User.create({
          name,
          email,
          password: hash
        })
      })
  }))
    .then(() => {
      console.log('Create success!')
      db.close()
      console.log('db close success')
    })
    .catch(err => console.log(err))
})