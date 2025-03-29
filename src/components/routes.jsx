import App from "./App";
import EditPostForm from "./Posts/EditPostForm";
import ErrorPage from "./ErrorPage";
import LoginForm from "./LoginForm";
import NewPostForm from "./Posts/NewPostForm";
import PostPage from "./Posts/PostPage";
import PostsPage from "./Posts/PostsPage";
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
