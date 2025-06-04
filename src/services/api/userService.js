import usersData from '../mockData/users.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let users = [...usersData]

const userService = {
  async getAll() {
    await delay(300)
    return [...users]
  },

  async getById(id) {
    await delay(200)
    const user = users.find(u => u.userId === id)
    return user ? { ...user } : null
  },

  async create(userData) {
    await delay(400)
    const newUser = {
      ...userData,
      userId: `user_${Date.now()}`,
      lastSeen: new Date().toISOString(),
      isOnline: true
    }
    users.push(newUser)
    return { ...newUser }
  },

  async update(id, updates) {
    await delay(300)
    const index = users.findIndex(u => u.userId === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...updates }
      return { ...users[index] }
    }
    throw new Error('User not found')
  },

  async delete(id) {
    await delay(250)
    const index = users.findIndex(u => u.userId === id)
    if (index !== -1) {
      const deleted = users.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error('User not found')
  },

  async updateOnlineStatus(id, isOnline) {
    await delay(200)
    const index = users.findIndex(u => u.userId === id)
    if (index !== -1) {
      users[index] = { 
        ...users[index], 
        isOnline,
        lastSeen: new Date().toISOString()
      }
      return { ...users[index] }
    }
    throw new Error('User not found')
  }
}

export default userService