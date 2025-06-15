import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnchorComponent } from "../../components/elements";
import PageLayout from "../../layouts/PageLayout";
import specifics from "../../assets/data/specifics.json";
import api from "../../routes/api";

export default function NotificationPage() {
  const filteredUsers = specifics.filter(
    (user) => user.type === "Usuário" && user.indications.length > 0
  );
  const [users, setUsers] = useState(filteredUsers);

  const [data, setData] = useState([]);
  console.log("🚀 ~ NotificationPage ~ data:", data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/users");
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleRemoveNotification = (index) => {
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    setUsers(updatedUsers);
  };

  return (
    <PageLayout>
      <div className="mc-card">
        <div className="mc-breadcrumb">
          <h3 className="mc-breadcrumb-title">Indicações</h3>
          <ul className="mc-breadcrumb-list">
            <li className="mc-breadcrumb-item">
              <Link to="/home" className="mc-breadcrumb-link">
                Inicio
              </Link>
            </li>
            <li className="mc-breadcrumb-item">Indicações</li>
          </ul>
        </div>
      </div>
      <div className="mc-card">
        <div className="mc-card-header">
          <h4 className="mc-card-title">Todas Indicações</h4>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0rem 24rem 0rem 0rem",
          }}
        >
          <h4 style={{ width: 420 }}>Nome Usuário</h4>
          <h4 className="mc-card-title">Cliente Indicado</h4>
          <h4 className="mc-card-title">Código</h4>
        </div>
        <ul
          style={{
            backgroundColor: "#e6e6e61a",
            paddingTop: 20,
            borderRadius: 8,
          }}
          className="mc-notify-list"
        >
          {users.map((user, index) => (
            <li
              className="mc-notify-item"
              key={index}
              style={{ padding: "15px 30px 15px 10px" }}
            >
              <AnchorComponent className="mc-notify-content" to={user.path}>
                <div className="mc-notify-media">
                  <img src={user.src} alt="avatar" />
                  <i className={`material-icons ${user.status}`}>campaign</i>
                </div>
                <div className="mc-notify-meta" style={{ width: 610 }}>
                  <small style={{ fontWeight: "bold", fontSize: 18 }}>
                    {user.name}
                  </small>
                  <small>Acabou de fazer uma indicação</small>
                  <small style={{ fontWeight: "bold" }}>
                    {user.longMoment}
                  </small>
                </div>
                <div
                  className="mc-notify-indicator"
                  style={{ marginTop: 20, width: 400 }}
                >
                  <small>Indicados: </small>
                  <small style={{ fontWeight: "bold" }}>
                    {user.indications.map((ind) => (
                      <small>{ind},</small>
                    ))}
                  </small>
                </div>
                <div style={{ marginTop: 20 }}>
                  <small>Código: </small>
                  <small style={{ fontWeight: "bold" }}>{user.code}</small>
                </div>
              </AnchorComponent>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 30,
                  marginRight: 20,
                  marginTop: 20,
                }}
              >
                <button
                  style={{ color: "#13cc13" }}
                  className="material-icons"
                  onClick={() => handleRemoveNotification(index)}
                >
                  check
                </button>
                <button
                  style={{ color: "#ff0000" }}
                  className="material-icons"
                  onClick={() => handleRemoveNotification(index)}
                >
                  close
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PageLayout>
  );
}
