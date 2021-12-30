import 'source-map-support/register'

import * as uuid from 'uuid'

import { Access } from '../data/Access'
import { Storage } from '../data/Storage'
import { CommentItem } from '../models/CommentItem '
import { PostItem } from '../models/PostItem'
import { CreateCommentRequest } from '../requests/CreateCommentRequest'
import { CreatePostRequest } from '../requests/CreatePostRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('todos')

const postsAccess = new Access()
const postsStorage = new Storage()

export async function getAllPosts(): Promise<PostItem[]> {
  logger.info(`Retrieving all posts`)

  return await postsAccess.getAllPosts()
}

export async function getPosts(userId: string): Promise<PostItem[]> {
  logger.info(`Retrieving all posts for user ${userId}`, { userId })

  return await postsAccess.getPosts(userId)
}

export async function getPostById(postId: string): Promise<PostItem> {
  logger.info(`Retrieving Post for id ${postId}`, { postId })

  return await postsAccess.getPostById(postId)
}

export async function closePostById(postId: string) {
  logger.info(`Closing Post for id ${postId}`, { postId })
  postsAccess.closePost(postId)
}

export async function getCommentById(commentId: string): Promise<CommentItem> {
  logger.info(`Retrieving comment for id ${commentId}`, { commentId })

  return await postsAccess.getCommentById(commentId)
}

export async function closeCommentById(commentId: string) {
  logger.info(`Closing Comment for id ${commentId}`, { commentId })
  postsAccess.closeComment(commentId)
}

export async function createPost(userId: string, createTodoRequest: CreatePostRequest): Promise<PostItem> {
  const postId = uuid.v4()

  const newItem: PostItem = {
    userId,
    postId,
    createdAt: new Date().toISOString(),
    done: false,
    comments: [],
    attachmentUrl: null,
    upvotes: 0,
    status: "Open",
    ...createTodoRequest
  }

  logger.info(`Creating post ${postId} for user ${userId}`, { userId, postId, todoItem: newItem })

  await postsAccess.createPost(newItem)

  return newItem
}

export async function getCommentsForPost(postId: string): Promise<CommentItem[]> {
  logger.info(`Retrieving all comments for post ${postId}`, { postId })

  return await postsAccess.getCommentsPost(postId)
}

export async function commentPost(userId: string, createTodoRequest: CreateCommentRequest): Promise<CommentItem> {
  const commentId = uuid.v4()

  const newItem: CommentItem = {
    commentId,
    userId,
    createdAt: new Date().toISOString(),
    accepted: false,
    upvotes: 0,
    ...createTodoRequest
  }

  logger.info(`Creating comment ${commentId} for user ${userId}`, { userId, commentId, todoItem: newItem })

  await postsAccess.commentPost(newItem)

  return newItem
}

export async function deletePost(userId: string, postId: string) {
  logger.info(`Deleting todo ${postId} for user ${userId}`, { userId, postId: postId })

  const item = await postsAccess.getTodoItem(postId)

  if (!item)
    throw new Error('Item not found')  // FIXME: 404?

  if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission to delete todo ${postId}`)
    throw new Error('User is not authorized to delete item')  // FIXME: 403?
  }

  postsAccess.deletePost(postId)
}

export async function updateAttachmentUrl(userId: string, todoId: string, attachmentId: string) {
  logger.info(`Generating attachment URL for attachment ${attachmentId}`)

  const attachmentUrl = await postsStorage.getAttachmentUrl(attachmentId)

  logger.info(`Updating todo ${todoId} with attachment URL ${attachmentUrl}`, { userId, todoId })

  const item = await postsAccess.getTodoItem(todoId)

  if (!item)
    throw new Error('Item not found')  // FIXME: 404?

  if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission to update todo ${todoId}`)
    throw new Error('User is not authorized to update item')  // FIXME: 403?
  }

  await postsAccess.updateAttachmentUrl(todoId, attachmentUrl)
}

export async function generateUploadUrl(attachmentId: string): Promise<string> {
  logger.info(`Generating upload URL for attachment ${attachmentId}`)

  const uploadUrl = await postsStorage.getUploadUrl(attachmentId)

  return uploadUrl
}