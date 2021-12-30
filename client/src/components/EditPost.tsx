import * as React from 'react'
import Auth from '../auth/Auth'
import { getPosts, getComments, createComment, closePost } from '../api/posts-api'
import { Post } from '../types/Post'
import { CommentModel } from '../types/CommentModel'
import { History } from 'history'
import {
  Button,
  Divider,
  Grid,
  Header,
  Image,
  Loader,
  Segment,
  Comment,
  Form,
  Icon
} from 'semantic-ui-react'

interface EditPostProps {
  match: {
    params: {
      postId: string
    }
  }
  auth: Auth
  history: History
}

interface EditPostState {
  posts: Post[],
  loadingPosts: boolean,
  loadingComments: boolean,
  comments: CommentModel[],
  newCommentDescription: string
}

export class EditPost extends React.PureComponent<
  EditPostProps,
  EditPostState
> {
  state: EditPostState = {
    posts: [],
    loadingPosts: true,
    loadingComments: true,
    comments: [],
    newCommentDescription: ''
  }

  async componentDidMount() {
    try {
      const todos = await getPosts(this.props.auth.getIdToken())
      this.setState({
        posts: todos,
        loadingPosts: false
      })   

      const comments = await getComments(this.props.auth.getIdToken(), this.props.match.params.postId)
      this.setState({
        comments,
        loadingComments: false
      })
    } catch (e) {
      alert(`Failed to fetch posts: ${e}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">NanoDegree Overflow</Header>

        {this.renderPosts()}
        {this.renderComments()}

      <Form reply>
        <Form.TextArea onChange={this.handleDescriptionChange} />
        <Button onClick={() => this.onCommentCreate()} content='Add Comment' labelPosition='left' icon='edit' primary />
      </Form>
      </div>
    )
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ newCommentDescription: event.target.value })
  }

  renderPosts() {
    if (this.state.loadingPosts) {
      return this.renderLoading()
    }

    return this.renderPostsList()
  }

  renderComments() {
    if (this.state.loadingComments) {
      return this.renderLoadingComments()
    }

    return this.renderCommentsList()
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

  
  renderLoadingComments() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Comments
        </Loader>
      </Grid.Row>
    )
  }

  renderPostsList() {
    return (
      <Grid padded>
        {this.state.posts
        .filter(post => post.postId === this.props.match.params.postId)
        .map((post) => {
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
              <Grid.Column width={10} verticalAlign="middle">
                <h1>{post.title}</h1>
              </Grid.Column>
              {post.attachmentUrl && (
                <Image src={post.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
              <Grid.Column width={16}>
                  <Segment inverted>{post.description}</Segment>
              </Grid.Column>
            </Grid.Row>
          )
        })}

      </Grid>
    )
  }

  renderCommentsList() {
    return (
      <Comment.Group size='huge' padded>
        {this.state.comments
        .filter(comment => comment.postId === this.props.match.params.postId)
        .map((comment) => {
          return (
            <Comment>
              <Comment.Metadata>
                <div>{comment.createdAt}</div>

                {comment.accepted && (
                  <Button>
                    Most voted answer
                    <Icon name="checkmark" />
                  </Button>
                )}

                {!comment.accepted && (
                  <Button
                    icon
                    color="green"
                    onClick={() => this.closePost(comment.commentId)}>
                                Accept as answer for question
                                <Icon name="question circle" />
                    </Button>
                )}
              </Comment.Metadata>
              <Comment.Text>
                {comment.description}
              </Comment.Text>
            </Comment>
          )
        })}
      </Comment.Group>
        )
  }

  closePost = async (commentId: string) => {
    try {
      await closePost(this.props.auth.getIdToken(), commentId)
      this.componentDidMount()
    } catch {
      alert('Post closing failed')
    }
  }

  onCommentCreate = async () => {
    try {
      const newComment = await createComment(this.props.auth.getIdToken(), {
        postId: this.props.match.params.postId,
        description: this.state.newCommentDescription
      })
      this.setState({
        comments: [...this.state.comments, newComment],
        newCommentDescription: ''
      })
    } catch {
      alert('Comment creation failed')
    }
  }
}
