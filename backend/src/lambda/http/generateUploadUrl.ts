import 'source-map-support/register'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { generateUploadUrl, updateAttachmentUrl } from '../../business/businessPosts'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info("Generating upload URL", {event})

    const postId = event.pathParameters.postId
    const userId = getUserId(event)
    const attachmentId = uuid.v4()
    
    const uploadUrl = await generateUploadUrl(attachmentId)

    await updateAttachmentUrl(userId, postId, attachmentId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uploadUrl
      })
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
