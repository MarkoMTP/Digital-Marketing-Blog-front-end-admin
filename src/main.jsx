import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import routes from "./components/routes.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PostProvider from "./components/PostProvider.jsx";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PostProvider>
      <RouterProvider router={router} />
    </PostProvider>
  </StrictMode>
);
