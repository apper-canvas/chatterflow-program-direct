import messagesData from '../mockData/messages.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let messages = [...messagesData]

const messageService = {
  async getAll() {
    await delay(250)
    return [...messages]
  },

  async getById(id) {
    await delay(200)
    const message = messages.find(m => m.messageId === id)
    return message ? { ...message } : null
  },

  async getByConversation(conversationId) {
    await delay(300)
    return messages
      .filter(m => m.conversationId === conversationId)
      .map(m => ({ ...m }))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  },

  async create(messageData) {
    await delay(400)
    const newMessage = {
      ...messageData,
      messageId: `msg_${Date.now()}`,
      timestamp: messageData.timestamp || new Date().toISOString(),
      status: messageData.status || 'sent'
    }
    messages.push(newMessage)
    return { ...newMessage }
  },

  async update(id, updates) {
    await delay(300)
    const index = messages.findIndex(m => m.messageId === id)
    if (index !== -1) {
      messages[index] = { ...messages[index], ...updates }
      return { ...messages[index] }
    }
    throw new Error('Message not found')
  },

  async delete(id) {
    await delay(250)
    const index = messages.findIndex(m => m.messageId === id)
    if (index !== -1) {
      const deleted = messages.splice(index, 1)[0]
      return { ...deleted }
    }
    throw new Error('Message not found')
  },

  async markAsRead(conversationId, userId) {
    await delay(200)
    const conversationMessages = messages.filter(m => 
      m.conversationId === conversationId && m.senderId !== userId
    )
    conversationMessages.forEach(message => {
      message.status = 'read'
    })
    return conversationMessages.map(m => ({ ...m }))
  }
}

export default messageService