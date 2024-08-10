import { Exception } from '@adonisjs/core/exceptions'

export default class ConversationNotFoundException extends Exception {
  static status = 404
  identifier = 'errors.E_CONVERSATION_NOT_FOUND'
  code = 'E_CONVERSATION_NOT_FOUND'
}
