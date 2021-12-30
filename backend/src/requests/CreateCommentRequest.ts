/**
 * Fields in a request to create a single Comment on a Post.
 */
export interface CreateCommentRequest {
  postId: string,
  description: string
}
