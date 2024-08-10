import ConversationService from '#services/conversation_service'
import MessageService from '#services/message_service'
import socket from '#services/socket_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MessagesController {
  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService
  ) {}
  /**
   * Display a list of resource
   */
  async index({ response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const messages = await this.messageService.findAllMessagesFromUserSerialized(user)
    return response.ok(messages)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, i18n, response, bouncer }: HttpContext) {
    const { content, receiverId, senderId, conversationId } =
      await this.messageService.validateMessageCreation(request, i18n)

    const conversation = await this.conversationService.findConversationByIdOrFail(conversationId)

    bouncer.with('ConversationPolicy').authorize('show', conversation)
    const message = await this.messageService.createMessage(
      { content, receiverId, senderId },
      conversation
    )
    socket.io.to('room:' + conversationId).emit('message:created', message.serialize())
    return response.created(message.serialize())
  }

  /**
   * Show individual record
   */
  async show({ params, response, bouncer }: HttpContext) {
    const message = await this.messageService.findMessageByIdOrFail(params.id)
    await bouncer.with('MessagePolicy').authorize('show', message)
    return response.ok(message.serialize())
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, i18n, response, bouncer }: HttpContext) {
    const message = await this.messageService.findMessageByIdOrFail(params.id)
    await bouncer.with('MessagePolicy').authorize('update', message)

    socket.io.to('room:' + message.conversationId).emit('message:updated', message.serialize())
    const newMessage = await this.messageService.updateMessage(message, request, i18n)
    return response.ok(newMessage.serialize())
  }

  /**
   * Delete record
   */
  async destroy({ params, response, bouncer }: HttpContext) {
    const message = await this.messageService.findMessageByIdOrFail(params.id)
    await bouncer.with('MessagePolicy').authorize('delete', message)
    socket.io.to('room:' + message.conversationId).emit('message:deleted', message.serialize())

    await message.delete()
    return response.noContent()
  }
}
