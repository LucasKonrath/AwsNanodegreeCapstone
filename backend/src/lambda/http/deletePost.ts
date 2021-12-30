import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deletePost } from '../../business/businessPosts'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'

const logger = createLogger('deletePost');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info("Deleting POST", {event})

    const userId = getUserId(event)
    const postId = event.pathParameters.postId

    await deletePost(userId, postId)
    
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
