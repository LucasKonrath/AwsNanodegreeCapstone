import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'

import { getPosts } from '../../business/businessPosts'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'

const logger = createLogger('getPosts');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    logger.info("Getting POSTS", {event})

    const userId = getUserId(event)
    const items = await getPosts(userId)

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
  