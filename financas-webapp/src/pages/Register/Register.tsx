import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { register } from "../../feature/auth/authThunks";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const error = useSelector(
    (state: RootState) => state.auth.error
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !username || !password) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      await dispatch(
        register({
          name,
          username,
          password,
        })
      ).unwrap();

      navigate("/login");
    } catch (error) {
      console.error("Erro ao cadastrar usuário", error);
    }
  };

  return (
    <div>
      <h1>Cadastro</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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

        <button type="submit">Cadastrar</button>

        <p>
            Já possui conta? <Link to="/login">Entrar</Link>
        </p>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

      </form>
    </div>
  );
}

export default Register;