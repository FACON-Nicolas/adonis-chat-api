import ConversationNotFoundException from '#exceptions/conversation_not_found_exception'
import Conversation from '#models/conversation'
import User from '#models/user'
import { createConversationValidator, updateConversationValidator } from '#validators/conversation'
import { RequestValidator } from '@adonisjs/core/http'
import { I18n } from '@adonisjs/i18n'

export default class ConversationService {
  async findAllConversationsFromUser(user: User) {
    return Conversation.query().where('creator_id', user.id).orWhere('guest_id', user.id).exec()
  }

  async findAllConversationsFromUserSerialized(user: User) {
    const conversations = await this.findAllConversationsFromUser(user)
    return conversations.map((conversation) => conversation.serialize())
  }

  async findConversationById(id: number) {
    return await Conversation.find(id)
  }

  async findConversationByIdOrFail(id: number) {
    const conversation = await this.findConversationById(id)
    if (!conversation) {
      throw new ConversationNotFoundException()
    }
    return conversation
  }

  async validateConversationCreation(request: RequestValidator, i18n: I18n) {
    return await request.validateUsing(createConversationValidator, {
      messagesProvider: i18n.createMessagesProvider(),
    })
  }

  async validateConversationUpdate(request: RequestValidator, i18n: I18n) {
    return await request.validateUsing(updateConversationValidator, {
      messagesProvider: i18n.createMessagesProvider(),
    })
  }

  async createConversation(name: string, creatorId: number, guestId: number) {
    return await Conversation.create({
      name,
      creatorId,
      guestId,
    })
  }

  async updateConversation(conversation: Conversation, request: RequestValidator, i18n: I18n) {
    return await conversation.merge(await this.validateConversationUpdate(request, i18n)).save()
  }
}
