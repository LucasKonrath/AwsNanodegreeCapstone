import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'

import { PostItem } from '../models/PostItem'
import { createLogger } from '../utils/logger'
import { CommentItem } from '../models/CommentItem '

const logger = createLogger('todosAccess')

const XAWS = AWSXRay.captureAWS(AWS)

export class Access {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly postsTable = process.env.POSTS_TABLE,
    private readonly postsByUserIndex = process.env.POSTS_BY_USER_INDEX,
    private readonly commentsTable = process.env.COMMENTS_TABLE,
    private readonly commentsByPostIndex = process.env.COMMENTS_BY_POST_INDEX
  ) {}

  async todoItemExists(todoId: string): Promise<boolean> {
    const item = await this.getTodoItem(todoId)
    return !!item
  }

  async getAllPosts(): Promise<PostItem[]> {
    logger.info(`Getting all posts from ${this.postsTable}`)

    const result = await this.docClient.query({
      TableName: this.postsTable
    }).promise()

    const items = result.Items

    logger.info(`Found ${items.length} posts in ${this.postsTable}`)

    return items as PostItem[]
  }

  async getPosts(userId: string): Promise<PostItem[]> {
    logger.info(`Getting all posts for user ${userId} from ${this.postsTable}`)

    const result = await this.docClient.query({
      TableName: this.postsTable,
      IndexName: this.postsByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = result.Items

    logger.info(`Found ${items.length} todos for user ${userId} in ${this.postsTable}`)

    return items as PostItem[]
  }

  async getTodoItem(postId: string): Promise<PostItem> {
    logger.info(`Getting todo ${postId} from ${this.postsTable}`)

    const result = await this.docClient.get({
      TableName: this.postsTable,
      Key: {
        postId
      }
    }).promise()

    const item = result.Item

    return item as PostItem
  }

  
  async getPostById(postId: string): Promise<PostItem> {
    logger.info(`Getting POST ${postId} from ${this.postsTable}`)

    const result = await this.docClient.get({
      TableName: this.postsTable,
      Key: {
        postId
      }
    }).promise()

    const item = result.Item

    return item as PostItem
  }

  
  async closePost(postId: string) {
    logger.info(`Updating todo item ${postId} in ${this.postsTable}`)

     await this.docClient.update({
      TableName: this.postsTable,
      Key: {
        postId
      },
      UpdateExpression: 'set currentState = :currentState, done = :done',
      ExpressionAttributeValues: {
        ":currentState": 'Closed',
        ":done": true
      }
    }).promise()   

  }

  async closeComment(commentId: string) {
    logger.info(`Updating comment ${commentId} in ${this.commentsTable}`)

   await this.docClient.update({
      TableName: this.commentsTable,
      Key: {
        commentId
      },
      UpdateExpression: 'set accepted = :accepted',
      ExpressionAttributeValues: {
        ":accepted": true
      }
    }).promise()   

  }

  async getCommentById(commentId: string): Promise<CommentItem> {
    logger.info(`Getting todo ${commentId} from ${this.commentsTable}`)

    const result = await this.docClient.get({
      TableName: this.commentsTable,
      Key: {
        commentId
      }
    }).promise()

    const item = result.Item

    return item as CommentItem
  }


  async createPost(postItem: PostItem) {
    logger.info(`Putting todo ${postItem.postId} into ${this.postsTable}`)

    await this.docClient.put({
      TableName: this.postsTable,
      Item: postItem,
    }).promise()
  }

  async getCommentsPost(postId: string): Promise<CommentItem[]> {
    logger.info(`Getting all posts for user ${postId} from ${this.commentsTable}`)

    const result = await this.docClient.query({
      TableName: this.commentsTable,
      IndexName: this.commentsByPostIndex,
      KeyConditionExpression: 'postId = :postId',
      ExpressionAttributeValues: {
        ':postId': postId
      }
    }).promise()

    const items = result.Items

    logger.info(`Found ${items.length} todos for post ${postId} in ${this.commentsTable}`)

    return items as CommentItem[]
  }

  async commentPost(commentItem: CommentItem) {
    logger.info(`Putting comment ${commentItem.commentId} into ${this.commentsTable}`)

    await this.docClient.put({
      TableName: this.commentsTable,
      Item: commentItem,
    }).promise()
  }

  async deletePost(postId: string) {
    logger.info(`Deleting POST ${postId} from ${this.postsTable}`)

    await this.docClient.delete({
      TableName: this.postsTable,
      Key: {
        postId: postId
      }
    }).promise()    
  }

  async updateAttachmentUrl(postId: string, attachmentUrl: string) {
    logger.info(`Updating attachment URL for post ${postId} in ${this.postsTable}`)

    await this.docClient.update({
      TableName: this.postsTable,
      Key: {
        todoId: postId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }).promise()
  }

}