import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnchorComponent } from "../../components/elements";
import PageLayout from "../../layouts/PageLayout";
import users from "../../assets/data/specifics.json";

export default function RequestClientPage() {
  const [requests, setRequests] = useState(
    users.filter((user) => user.type === "Usuário" && user.withdrawalDate)
  );

  const handleAcceptRequest = (event, index) => {
    event.stopPropagation();
    const updatedRequests = [...requests];
    updatedRequests.splice(index, 1);
    setRequests(updatedRequests);
  };

  const handleRejectRequest = (event, index) => {
    event.stopPropagation();
    const updatedRequests = [...requests];
    updatedRequests.splice(index, 1);
    setRequests(updatedRequests);
  };

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

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Chave Pix copiada!");
      })
      .catch((err) => {
        console.error("Erro ao copiar a chave Pix: ", err);
      });
  };

  return (
    <PageLayout>
      <div className="mc-card">
        <div className="mc-breadcrumb">
          <h3 className="mc-breadcrumb-title">Solicitações Saque</h3>
          <ul className="mc-breadcrumb-list">
            <li className="mc-breadcrumb-item">
              <Link to="/home" className="mc-breadcrumb-link">
                Inicio
              </Link>
            </li>
            <li className="mc-breadcrumb-item">Solicitações</li>
          </ul>
        </div>
      </div>
      <div className="mc-card">
        <div className="mc-card-header">
          <h4 className="mc-card-title">Todas Solicitações de usuários</h4>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0rem 30.5rem 0rem 0rem",
          }}
        >
          <h4 style={{ width: 420 }}>Nome Usuário</h4>
          <h4 style={{ marginLeft: 20 }}>Saque / Total</h4>
          <h4 className="mc-card-title">Chave Pix</h4>
          <h4 className="mc-card-title">Documento</h4>
        </div>
        <ul
          style={{
            backgroundColor: "#e6e6e61a",
            paddingTop: 20,
            borderRadius: 8,
          }}
          className="mc-notify-list"
        >
          {requests
            .filter((notification) => notification.withdrawalDate)
            .map((notification, index) => (
              <li
                className="mc-notify-item"
                key={index}
                onClick={() => copyToClipboard(notification.pix)}
              >
                <AnchorComponent className="mc-notify-content">
                  <div className="mc-notify-media">
                    <img src={notification.src} alt="alter" />
                    <i className={`material-iconss ${notification.status}`}>
                      "campaign"
                    </i>
                  </div>
                  <div
                    style={{
                      width: 450,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <small className="mc-notify-name">
                      {notification.name}
                    </small>
                    <small>Acabou de fazer uma solicitação de saque</small>
                    <small className="mc-notify-longmoment">
                      {calculateLongMoment(notification.withdrawalDate)}
                    </small>
                    <small className="mc-notify-longmoment">
                      {notification.status}
                    </small>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      fontWeight: "bold",
                      marginTop: 23,
                    }}
                  >
                    <div style={{ width: 230 }}>
                      <small>
                        {notification.widrouwMoney}/{notification.disponible}
                      </small>
                    </div>
                    <div style={{ width: 190 }}>
                      <small>{notification.pix}</small>
                    </div>
                    <div style={{ width: 170 }}>
                      <small>{notification.document}</small>
                    </div>
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
                    onClick={(event) => handleAcceptRequest(event, index)}
                  >
                    check
                  </button>
                  <button
                    style={{ color: "#ff0000" }}
                    className="material-icons"
                    onClick={(event) => handleRejectRequest(event, index)}
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
