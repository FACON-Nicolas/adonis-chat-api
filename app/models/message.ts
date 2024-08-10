import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Conversation from './conversation.js'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare content: string

  @column({ columnName: 'sender_id' })
  declare senderId: number

  @column({ columnName: 'receiver_id' })
  declare receiverId: number

  @column({ columnName: 'conversation_id' })
  declare conversationId: number

  @belongsTo(() => User, {
    foreignKey: 'sender_id',
  })
  declare sender: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'receiver_id',
  })
  declare receiver: BelongsTo<typeof User>

  @belongsTo(() => Conversation)
  declare conversation: BelongsTo<typeof Conversation>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
