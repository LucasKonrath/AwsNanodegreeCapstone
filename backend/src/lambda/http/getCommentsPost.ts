import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'

import { getCommentsForPost} from '../../business/businessPosts'

import { createLogger } from '../../utils/logger'

const logger = createLogger('getCommentsPost');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    logger.info("Getting Comments for post", {event})

    const postId = event.pathParameters.postId

    const items = await getCommentsForPost(postId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items
      })
    }
  })
