import App from "./App";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

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
];

export default routes;
