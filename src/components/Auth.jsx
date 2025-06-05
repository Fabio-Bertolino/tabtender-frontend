import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { IS_LOGIN, IS_NOT_LOGIN, SET_PASSWORD, SET_TOKEN, SET_USERNAME } from "../redux/actions";

const Auth = () => {
  const username = useSelector((state) => state.auth.username);
  const password = useSelector((state) => state.auth.password);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await api.post(`${apiUrl}${endpoint}`, { username, password });
      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
      dispatch({ type: SET_TOKEN, payload: newToken });
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Errore");
    }
  };

  if (token) {
    return (
      <Alert variant="success">
        Sei già autenticato. Vai alla sezione <Link to={"/"}>tavoli</Link>.
      </Alert>
    );
  }

  return (
    <Container>
      <h2>{isLogin ? "Login" : "Registrazione"}</h2>
      <Form onSubmit={handleSubmit}>
        <div className="mb-3">
          <Form.Control
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => dispatch({ type: SET_USERNAME, payload: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <Form.Control
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => dispatch({ type: SET_PASSWORD, payload: e.target.value })}
            required
          />
        </div>

        <Button type="submit" variant="primary">
          {isLogin ? "Login" : "Registrati"}
        </Button>
        <Button
          type="button"
          className="btn btn-link"
          onClick={() => dispatch({ type: isLogin ? IS_NOT_LOGIN : IS_LOGIN })}
        >
          {isLogin ? "Crea un account" : "Hai già un account? Login"}
        </Button>
      </Form>
    </Container>
  );
};

export default Auth;
