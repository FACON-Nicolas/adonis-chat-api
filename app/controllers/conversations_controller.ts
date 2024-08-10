import ConversationService from '#services/conversation_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ConversationsController {
  constructor(private readonly conversationService: ConversationService) {}

  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const conversations =
      await this.conversationService.findAllConversationsFromUserSerialized(user)
    return response.ok(conversations)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, i18n, response }: HttpContext) {
    const { name, creatorId, guestId } =
      await this.conversationService.validateConversationCreation(request, i18n)

    const conversation = await this.conversationService.createConversation(name, creatorId, guestId)
    return response.created(conversation.serialize())
  }

  /**
   * Show individual record
   */
  async show({ params, response, bouncer }: HttpContext) {
    const conversation = await this.conversationService.findConversationByIdOrFail(params.id)
    await bouncer.with('ConversationPolicy').authorize('show', conversation)
    return response.ok(conversation.serialize())
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, i18n, response, bouncer }: HttpContext) {
    let conversation = await this.conversationService.findConversationByIdOrFail(params.id)
    await bouncer.with('ConversationPolicy').authorize('update', conversation)
    conversation = await this.conversationService.updateConversation(conversation, request, i18n)
    return response.ok(conversation.serialize())
  }

  /**
   * Delete record
   */
  async destroy({ params, response, bouncer }: HttpContext) {
    const conversation = await this.conversationService.findConversationByIdOrFail(params.id)
    await bouncer.with('ConversationPolicy').authorize('delete', conversation)
    await conversation.delete()
    return response.noContent()
  }
}
