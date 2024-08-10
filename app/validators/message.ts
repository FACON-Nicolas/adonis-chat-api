import vine, { Vine } from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new message.
 */

const userRule = (vine: Vine) =>
  vine
    .number()
    .positive()
    .withoutDecimals()
    .exists(async (db, value) => !!(await db.from('users').where('id', value)))

export const createMessageValidator = vine.compile(
  vine.object({
    content: vine.string().trim(),
    receiverId: userRule(vine),
    senderId: userRule(vine),
    conversationId: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists(async (db, value) => !!(await db.from('conversations').where('id', value))),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing message.
 */
export const updateMessageValidator = vine.compile(
  vine.object({
    content: vine.string().trim(),
  })
)
