import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new conversation.
 */
export const createConversationValidator = vine.compile(
  vine.object({
    creatorId: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists(async (db, value) => !!(await db.from('users').where('id', value))),
    guestId: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists(async (db, value) => !!(await db.from('users').where('id', value))),
    name: vine.string().trim(),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing conversation.
 */
export const updateConversationValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
  })
)
