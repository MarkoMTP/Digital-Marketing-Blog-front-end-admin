import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  const handleClick1 = async () => {
    await navigate("/login");
  };

  const handleClick2 = async () => {
    await navigate("/register");
  };

  return (
    <>
      <h1>Welcome</h1>

      <button onClick={() => handleClick1()}>Login</button>
      <button onClick={() => handleClick2()}>Register</button>
    </>
  );
};

export default App;
