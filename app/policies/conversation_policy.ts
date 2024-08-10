import User from '#models/user'
import Conversation from '#models/conversation'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class ConversationPolicy extends BasePolicy {
  update(user: User, conversation: Conversation): AuthorizerResponse {
    return conversation.creatorId === +user.id
  }

  delete(user: User, conversation: Conversation): AuthorizerResponse {
    return conversation.creatorId === +user.id
  }

  show(user: User, conversation: Conversation): AuthorizerResponse {
    return conversation.creatorId === +user.id || conversation.guestId === +user.id
  }
}
