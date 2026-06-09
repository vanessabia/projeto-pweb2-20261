import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Login realizado com sucesso!</p>

      <button onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}

export default Dashboard;