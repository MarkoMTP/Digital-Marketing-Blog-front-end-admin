import App from "./App";
import ErrorPage from "./ErrorPage";
import LoginForm from "./LoginForm";
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
];

export default routes;
