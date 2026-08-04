import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { login } from "../../feature/auth/authThunks";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const error = useSelector(
    (state: RootState) => state.auth.error
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      await dispatch(
        login({
          username,
          password,
        })
      ).unwrap();

      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">Entrar</button>

          <p>
            Não possui conta?{" "}
            <Link to="/register">Cadastre-se</Link>
          </p>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;