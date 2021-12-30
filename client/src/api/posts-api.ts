import { apiEndpoint } from '../config'
import { Post } from '../types/Post';
import { CreatePostRequest } from '../types/CreatePostRequest';
import { CreateCommentRequest } from '../types/CreateCommentRequest';
import Axios from 'axios'
import { CommentModel } from '../types/CommentModel';

export async function getPosts(idToken: string): Promise<Post[]> {
  console.log('Fetching posts')

  const response = await Axios.get(`${apiEndpoint}/posts`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('posts:', response.data)
  return response.data.items
}

export async function getComments(idToken: string, postId: string): Promise<CommentModel[]> {
  console.log('Fetching comments')

  const response = await Axios.get(`${apiEndpoint}/comments/${postId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('comments:', response.data)
  return response.data.items
}

export async function createPost(
  idToken: string,
  newPost: CreatePostRequest
): Promise<Post> {
  const response = await Axios.post(`${apiEndpoint}/posts`,  JSON.stringify(newPost), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function createComment(
  idToken: string,
  newComment: CreateCommentRequest
): Promise<CommentModel> {
  const response = await Axios.post(`${apiEndpoint}/comment`,  JSON.stringify(newComment), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function deletePost(
  idToken: string,
  postId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/posts/${postId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function closePost(
  idToken: string,
  commentId: string
): Promise<void> {
  await Axios.put(`${apiEndpoint}/post/close/${commentId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}
