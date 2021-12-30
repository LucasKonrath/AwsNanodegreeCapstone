export interface PostItem {
  userId: string
  postId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string,
  comments: string[],
  upvotes: number,
  title: string,
  status: string,
  description: string
}
