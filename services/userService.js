const bcrypt = require('bcryptjs')
const User = require('../models/User')

const userService = {
  register: async (registerInfo) => {
    const { name, email, password, confirmPassword } = registerInfo
    const error = []

    if (!name || !email || !password || !confirmPassword) {
      error.push('All fields are required')
    }
    if (password !== confirmPassword) {
      error.push('Password dose not match confirmPassword')
    }
    if (error.length) {
      throw new Error(error)
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    await User.create({
      name,
      email,
      password: hash
    })
  }
}

module.exports = userService