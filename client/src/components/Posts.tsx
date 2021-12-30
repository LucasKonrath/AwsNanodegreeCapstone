import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Loader
} from 'semantic-ui-react'

import { createPost as createPost, deletePost, getPosts} from '../api/posts-api'
import Auth from '../auth/Auth'
import { Post } from '../types/Post'

interface PostsProps {
  auth: Auth
  history: History
}

interface PostsState {
  posts: Post[]
  newPostName: string
  loadingPosts: boolean,
  newPostDescription: string
}

export class Posts extends React.PureComponent<PostsProps, PostsState> {
  state: PostsState = {
    posts: [],
    newPostName: '',
    loadingPosts: true,
    newPostDescription: ''
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPostName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPostDescription: event.target.value })
  }

  onEditButtonClick = (postId: string) => {
    this.props.history.push(`/posts/${postId}/view`)
  }

  onPostCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createPost(this.props.auth.getIdToken(), {
        name: this.state.newPostName,
        dueDate,
        title: this.state.newPostName,
        description: this.state.newPostDescription
      })
      this.setState({
        posts: [...this.state.posts, newTodo],
        newPostName: ''
      })
    } catch {
      alert('Post creation failed')
    }
  }

  onPostDelete = async (postId: string) => {
    try {
      await deletePost(this.props.auth.getIdToken(), postId)
      this.setState({
        posts: this.state.posts.filter(todo => todo.postId !== postId)
      })
    } catch {
      alert('Post deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const posts = await getPosts(this.props.auth.getIdToken())
      this.setState({
        posts: posts,
        loadingPosts: false
      })
    } catch (e) {
      alert(`Failed to fetch posts: ${e}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">NanoDegree Overflow</Header>

        {this.renderCreatePostInput()}

        {this.renderPosts()}
      </div>
    )
  }

  renderCreatePostInput() {
    return (
      <Grid container stackable verticalAlign="middle">
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'orange',
              labelPosition: 'left',
              icon: 'add',
              content: 'Create a new Post',
              onClick: this.onPostCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Currently facing problems with..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>

      <Grid.Column width={16}>
          <Input
            size="large"
            fluid
            placeholder="Describe your problem in more details"
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
      </Grid.Row>
      </Grid>
    )
  }

  renderPosts() {
    if (this.state.loadingPosts) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Issues
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.posts.map((post) => {
          return (
            <Grid.Row key={post.postId}>
              <Grid.Column width={3} verticalAlign="middle">

              {post.done && (
                <h2 style={{ color: 'red' }}>Closed</h2>
              )}

              {!post.done && (
                <h2 style={{ color: 'green' }}>Open</h2>
              )}
              </Grid.Column>
              <Grid.Column width={9} verticalAlign="middle">
                <h1 onClick={() => this.onEditButtonClick(post.postId)}>{post.title}</h1>
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {post.dueDate}
              </Grid.Column>

              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onPostDelete(post.postId)}
                >
                  <Icon name="delete" />
                </Button>
              
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
