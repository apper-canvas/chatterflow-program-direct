import conversationsData from '../mockData/conversations.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let conversations = [...conversationsData]

const conversationService = {
  async getAll() {
    await delay(300)
    return [...conversations]
  },

  async getById(id) {
    await delay(200)
    const conversation = conversations.find(c => c.conversationId === id)
    return conversation ? { ...conversation } : null
  },

  async create(conversationData) {
    await delay(400)
    const newConversation = {
      ...conversationData,
      conversationId: `conv_${Date.now()}`,
      unreadCount: 0,
      isPinned: false,
      isMuted: false
    }
    conversations.push(newConversation)
    return { ...newConversation }
  },

  async update(id, updates) {
    await delay(300)
    const index = conversations.findIndex(c => c.conversationId === id)
    if (index !== -1) {
      conversations[index] = { ...conversations[index], ...updates }
      return { ...conversations[index] }
    }
    throw new Error('Conversation not found')
  },

  async delete(id) {
    await delay(250)
    const index = conversations.findIndex(c => c.conversationId === id)
    if (index !== -1) {
      const deleted = conversations.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error('Conversation not found')
  }
}

export default conversationService