import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, beforeFind, column, hasMany } from '@adonisjs/lucid/orm'
import Message from '#models/message'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({ columnName: 'creator_id' })
  declare creatorId: number

  @column({ columnName: 'guest_id' })
  declare guestId: number

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeFind()
  @beforeFetch()
  static withMessages(query: ModelQueryBuilderContract<typeof Conversation>) {
    query.preload('messages')
  }
}
