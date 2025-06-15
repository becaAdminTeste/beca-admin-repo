import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/Themes";
import { SidebarContext } from "../context/Sidebar";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import specifics from "../assets/data/specifics.json";
import { useAppContext } from "../context/AppProvider";
import BASE_URL from "../config";
import axios from "axios";

export default function HeaderLayout() {
  const { dashboardUser, setDashboardUserType, dashboardUserType, userImage, token } = useAppContext();

  useEffect(() => {
    const handleUserDashRegister = async () => {
      if (!token || !dashboardUser?.userTypeId) {
        console.warn("Token or User Type ID is missing.");
        return;
      }
  
      const url = `${BASE_URL}/usertypes`;
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        if (response.status === 200) {
          const userType = response.data.find(
            (data) => data.id === dashboardUser.userTypeId
          );
          if (userType) {
            setDashboardUserType(userType.name);
          }
        }
      } catch (error) {
        console.error("Error fetching user types:", error);
      }
    };
  
    handleUserDashRegister();
  }, [token, dashboardUser?.userTypeId, setDashboardUserType]);
  const [requests] = useState(
    specifics.filter(
      (user) =>
        user.type === "Usuário" &&
        user.status !== ("bloqueado" || "inativo") &&
        user.withdrawalDate
    )
  );
  const [payments] = useState(
    specifics.filter(
      (item) =>
        item.type === "Professional" &&
        item.status !== ("bloqueado" || "pendente")
    )
  );
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { sidebar, toggleSidebar } = useContext(SidebarContext);

  const calculateLongMoment = (timestamp) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);

    if (diffInSeconds < 60) {
      return "a poucos segundos";
    } else if (diffInSeconds < 3600) {
      return "a alguns minutos";
    } else if (diffInSeconds < 86400) {
      return "a algumas horas";
    } else {
      return "a alguns dias";
    }
  };

  const [scroll, setScroll] = useState("fixed");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) setScroll("sticky");
    else setScroll("fixed");
  });

  return (
    <header className={`mc-header ${scroll}`}>
      <Link to="/home" className="mc-logo-group">
        <span>
          <img src="/images/BecaLogo.png" alt="logo" />
        </span>
      </Link>
      <div className="mc-header-group">
        <div className="mc-header-left">
          <button
            type="button"
            className="mc-header-icon toggle"
            onClick={toggleSidebar}
          >
            <i className="material-icons">{sidebar ? "menu_open" : "menu"}</i>
          </button>
        </div>

        <div className="mc-header-right">
          <button
            type="button"
            className="mc-header-icon theme"
            onClick={toggleTheme}
          >
            <i className="material-icons">{theme}</i>
          </button>
          <Dropdown className="notify">
            <Dropdown.Toggle className="mc-dropdown-toggle mc-header-icon">
              <i className="material-icons">person</i>
              <sup className="primary">{requests.length}</sup>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="mc-dropdown-paper">
              <div className="mc-header-dropdown-group">
                <div className="mc-card-header">
                  <h4 className="mc-card-title">
                    Solicitações de saque ({requests.length})
                  </h4>
                </div>

                <ul className="mc-header-dropdown-list thin-scrolling">
                  {requests?.map((request, index) => (
                    <li
                      key={index}
                      className={`mc-header-dropdown-item ${
                        request.status === "ativo"
                      }`}
                    >
                      <Link to="#" className="mc-header-dropdown-content">
                        <div className="mc-header-dropdown-notify-media">
                          <img src={request?.src} alt="avatar" />
                          <i className={`material-iconss yellow `}>campaign</i>
                        </div>

                        <div className="mc-header-dropdown-meta">
                          <h4>
                            <span>{request.name}</span>
                          </h4>
                          <p>Acabou de fazer uma solicitação</p>
                          <p>{calculateLongMoment(request.withdrawalDate)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/requestClient"
                  className="mc-btn primary mc-header-dropdown-button"
                >
                  Ver todas solicitações de saque
                </Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="notify">
            <Dropdown.Toggle className="mc-dropdown-toggle mc-header-icon">
              <i className="material-icons">contact_mail</i>
              <sup className="primary">{payments.length}</sup>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="mc-dropdown-paper">
              <div className="mc-header-dropdown-group">
                <div className="mc-card-header">
                  <h4 className="mc-card-title">
                    Solicitações de saque ({payments.length})
                  </h4>
                </div>

                <ul className="mc-header-dropdown-list thin-scrolling">
                  {payments?.map((payments, index) => (
                    <li
                      key={index}
                      className={`mc-header-dropdown-item ${
                        payments.status === "ativo"
                      }`}
                    >
                      <Link to="#" className="mc-header-dropdown-content">
                        <div className="mc-header-dropdown-notify-media">
                          <img src={payments?.src} alt="avatar" />
                          <i
                            className={`material-icons ${
                              payments.status === "ativo" ? "green" : "yellow"
                            } `}
                          >
                            campaign
                          </i>
                        </div>

                        <div className="mc-header-dropdown-meta">
                          <h4>
                            <span>{payments.name}</span>
                          </h4>
                          <p>Acabou de fazer uma solicitação</p>
                          <p>{calculateLongMoment(payments.withdrawalDate)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/requestProfessional"
                  className="mc-btn primary mc-header-dropdown-button"
                >
                  Ver todas solicitações de saque
                </Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="mc-header-user">
            <Dropdown.Toggle className="mc-dropdown-toggle">
              <Link to="#" className="mc-round-avatar xs">
                <img src={userImage} alt="avatar" />
              </Link>
              <div className="mc-duel-text xs">
                <h3 className="mc-duel-text-title">{dashboardUser?.name}</h3>
                <p className="mc-duel-text-descrip">{dashboardUserType}</p>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="mc-dropdown-paper">
              <Link to="/my-account" className="mc-dropdown-menu">
                <i className="material-icons">person</i>
                <span>Minha Conta</span>
              </Link>
              <Link to="/" className="mc-dropdown-menu">
                <i className="material-icons">lock</i>
                <span>logout</span>
              </Link>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
