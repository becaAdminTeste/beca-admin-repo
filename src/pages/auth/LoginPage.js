import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconFieldComponent from "../../components/fields/IconFieldComponent";
import LogoComponent from "../../components/LogoComponent";
import BASE_URL from "../../config";
import { useAppContext } from "../../context/AppProvider";

const ADMIN_USER_TYPES = "c4de9511-3b29-436a-b266-ee392c2d3f88";

export default function LoginPage() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const { setDashboardUser, setToken, token } = useAppContext();

  const handleUserDashRegister = async (userId) => {
    const url = `${BASE_URL}/users/${userId}`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setDashboardUser(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  const handleLogin = async () => {
    const url = `${BASE_URL}/sessions`;
    try {
      const response = await axios.post(url, {
        email: data.email,
        password: data.password,
      });
      if (response.status === 200) {
        console.log(response);
        const token = response.data.access_token;
        localStorage.setItem("token", token);
        setToken(token);
        navigate("/home");
      }
      const usersResponse = await axios.get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = usersResponse.data.users.find(
        (user) => user.email === data.email
      );

      if (user.userTypeId && ADMIN_USER_TYPES.includes(user.userType_id)) {
        await handleUserDashRegister(response.data.user);
      }
    } catch (error) {
      alert(
        "Ocorreu um erro com seu login, verifique as informações e tente novamente"
      );
    }
  };

  return (
    <div className="mc-auth">
      <img
        src="images/pattern.webp"
        alt="pattern"
        className="mc-auth-pattern"
      />
      <div className="mc-auth-group">
        <LogoComponent
          src="images/BecaLogo2.png"
          alt="logo"
          href="/"
          className="mc-auth-logo"
          name={undefined}
        />
        <h4 className="mc-auth-title">Login</h4>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "35px",
            marginBottom: "20px",
            borderRadius: "8px",
            backgroundColor: "#03032e8c",
            border: "1px solid white",
            gap: 10,
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <IconFieldComponent
            icon="email"
            type="email"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="email"
          />
          <IconFieldComponent
            icon="lock"
            type="password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
            placeholder="senha"
            passwordVisible={true}
          />
          <button className="mc-auth-btn h-sm" type="submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
