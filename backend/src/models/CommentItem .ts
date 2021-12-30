export interface CommentItem {
  userId: string
  postId: string
  commentId: string
  createdAt: string
  accepted: boolean
  upvotes: number
  description: string
}
