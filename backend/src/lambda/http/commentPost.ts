import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateCommentRequest } from '../../requests/CreateCommentRequest'
import { getUserId } from '../utils';
import { commentPost } from '../../business/businessPosts'
import { createLogger } from '../../utils/logger'

const logger = createLogger('commentPost');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info("Commenting POST", {event})
    const newTodo: CreateCommentRequest = JSON.parse(event.body)
    const userId = getUserId(event);

    const savedItem = await commentPost(userId, newTodo)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: savedItem
      })
      }
    }
)

handler.use(
  cors({
    credentials: true
  })
)
