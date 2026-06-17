import {Router} from 'express'
import { getChats, getMessages, sendMessage, deleteChat } from '../controllers/chat.controller.js'
import { authUser } from '../middleware/auth.middleware.js'
import {uploadFile} from '../controllers/chat.controller.js'
import multer from 'multer'


const upload = multer({
  storage: multer.memoryStorage()
});


const chatRouter = Router()

/**
 * @desc Send a message to the AI model
 * @route POST /api/chat/message
 * @access Private
 * @header {Authorization: Bearer token}
 */
chatRouter.post("/message",authUser, sendMessage)

/**
 * @desc Get all chats for the authenticated user
 * @route GET /api/chat/
 * @access Private
 * @header {Authorization: Bearer token}
 */
chatRouter.get("/", authUser, getChats)

/**
 * @desc Get messages for a specific chat
 * @route GET /api/chat/:chatId/messages
 * @access Private
 * @header {Authorization: Bearer token}
 */
chatRouter.get("/:chatId/messages", authUser, getMessages)

/**
 * @desc Delete a chat
 * @route DELETE /api/chat/delete/:chatId
 * @access Private
 * @header {Authorization: Bearer token}
 */
chatRouter.delete("/delete/:chatId", authUser, deleteChat)

/**
 * @desc Upload a file
 * @route POST /api/chat/upload
 * @access Private
 * @header {Authorization: Bearer token}
 */
chatRouter.post("/upload",upload.single('file'), authUser, uploadFile)

export default chatRouter