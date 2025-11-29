import App from "./App";
import EditPostForm from "./Posts/EditPostForm";
import ErrorPage from "./ErrorPage";
import LoginForm from "./LoginForm";
import NewPostForm from "./Posts/NewPostForm";
import PostPage from "./Posts/PostPage";
import PostsPage from "./Posts/PostsPage";
import RegisterForm from "./RegisterForm";
import RegisterSuccess from "./RegSuccess";
import DraftsPage from "./Posts/DraftsPage";

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
    path: "/posts/:postId",
    element: <PostPage />,
  },
  {
    path: "/editPostForm/:postId",
    element: <EditPostForm />,
  },
  {
    path: "/homepage",
    element: <PostsPage />,
  },
  {
    path: "/newPostForm",
    element: <NewPostForm />,
  },

  {
    path: "/drafts",
    element: <DraftsPage />,
  },
];

export default routes;
