export interface Todo {
  postId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string,
  title: string,
  comments: string[],
  status: string,
  description: string
}
