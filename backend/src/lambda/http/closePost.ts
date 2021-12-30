import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { closePostById, getCommentById, closeCommentById } from '../../business/businessPosts'
import { createLogger } from '../../utils/logger'

const logger = createLogger('closePost');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info("Closing post", {event})

    const commentId = event.pathParameters.commentId

    const savedComment = await getCommentById(commentId)
    
    closePostById(savedComment.postId)
  
    closeCommentById(commentId)
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: savedComment
      })
      }
    }
)

handler.use(
  cors({
    credentials: true
  })
)
