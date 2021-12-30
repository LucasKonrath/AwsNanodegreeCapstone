import * as React from 'react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, getTodos, getComments, createComment, closePost } from '../api/todos-api'
import { Todo } from '../types/Todo'
import { CommentModel } from '../types/CommentModel'
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

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditTodoProps {
  match: {
    params: {
      postId: string
    }
  }
  auth: Auth
}

interface EditTodoState {
  file: any
  uploadState: UploadState,
  todos: Todo[],
  loadingTodos: boolean,
  loadingComments: boolean,
  comments: CommentModel[],
  newCommentDescription: string
}

export class EditTodo extends React.PureComponent<
  EditTodoProps,
  EditTodoState
> {
  state: EditTodoState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    todos: [],
    loadingTodos: true,
    loadingComments: true,
    comments: [],
    newCommentDescription: ''
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.postId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })

      const comments = await getComments(this.props.auth.getIdToken(), this.props.match.params.postId)
      this.setState({
        comments,
        loadingComments: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">NanoDegree Overflow</Header>

        {this.renderTodos()}
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

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
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

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.todos
        .filter(todo => todo.postId === this.props.match.params.postId)
        .map((todo, pos) => {
          return (
            <Grid.Row key={todo.postId}>
              <Grid.Column width={1} verticalAlign="middle">
              {todo.status}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                <h1>{todo.title}</h1>
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
              <Grid.Column width={16}>
                  <Segment inverted>{todo.description}</Segment>
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
        .map((comment, pos) => {
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
                                Accept question as answer
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
      window.location.reload(); 
    } catch {
      alert('Post closing failed')
    }
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }

  onCommentCreate = async () => {
    try {
      const newTodo = await createComment(this.props.auth.getIdToken(), {
        postId: this.props.match.params.postId,
        description: this.state.newCommentDescription
      })
      this.setState({
        comments: [...this.state.comments, newTodo],
        newCommentDescription: ''
      })
    } catch {
      alert('Comment creation failed')
    }
  }
}
