import App from "./App";
import EditPostForm from "./EditPostForm";
import ErrorPage from "./ErrorPage";
import LoginForm from "./LoginForm";
import NewCommentForm from "./NewCommentForm";
import NewPostForm from "./NewPostForm";
import PostPage from "./PostPage";
import PostsPage from "./PostsPage";
import RegisterForm from "./RegisterForm";
import RegisterSuccess from "./RegSuccess";

const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    path: "/registrationSuccess",
    element: <RegisterSuccess />,
  },
  {
    path: "/error",
    element: <ErrorPage />,
  },
  {
    path: "/posts",
    element: <PostsPage />,
  },
  {
    path: "/posts/:postId",
    element: <PostPage />,
  },
  {
    path: "/editPostForm/:postId",
    element: <EditPostForm />,
  },
  {
    path: "/homepage",
    element: <EditPostForm />,
  },
  {
    path: "/newPostForm",
    element: <NewPostForm />,
  },
];

export default routes;
