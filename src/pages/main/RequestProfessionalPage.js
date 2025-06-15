import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnchorComponent } from "../../components/elements";
import PageLayout from "../../layouts/PageLayout";
import specifics from "../../assets/data/specifics.json";

export default function RequestProfessionalPage() {
  const [payments, setPayments] = useState(
    specifics
      .filter((item) => item.type === "Professional")
      .map((item, index) => ({ ...item, id: index }))
  );

  const addMonth = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const newDate = new Date(year, month - 1, day);
    newDate.setMonth(newDate.getMonth() + 1);
    return formatDate(newDate);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(2);
    return `${day}/${month}/${year}`;
  };

  const handleCheckClick = (event, id) => {
    event.stopPropagation();
    const updatedPayments = [...payments];
    const itemIndex = updatedPayments.findIndex((payment) => payment.id === id);
    if (itemIndex !== -1) {
      const itemClicked = updatedPayments[itemIndex];
      itemClicked.lastPayment = addMonth(itemClicked.lastPayment);
      itemClicked.nextPayment = addMonth(itemClicked.nextPayment);
      updatedPayments.splice(itemIndex, 1);
      updatedPayments.push(itemClicked);
      setPayments(updatedPayments);
    }
  };

  const handleCloseClick = (event, id) => {
    event.stopPropagation();
    const updatedPayments = payments.filter((payment) => payment.id !== id);
    setPayments(updatedPayments);
  };

  const filteredPayments = payments.filter(
    (payment) => payment.status !== "pendente"
  );

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Chave Pix copiada!");
      })
      .catch((err) => {
        console.error(err);
        alert("Ocorreu um erro tente novamente.");
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
          <h4 className="mc-card-title">Todas Solicitações de profissionais</h4>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h4 style={{ width: 440 }}>Nome Usuário</h4>
          <h4 style={{ width: 175 }}>Valor mensal</h4>
          <h4 style={{ width: 170 }}>Chave Pix</h4>
          <h4 style={{ width: 170 }}>Documento</h4>
          <h4 style={{ width: 110 }}>Clientes</h4>
          <h4 style={{ width: 130 }}>Ultimo Pag.</h4>
          <h4 style={{ width: 130 }}>Próximo Pag.</h4>
        </div>
        <ul
          style={{
            backgroundColor: "#e6e6e61a",
            paddingTop: 20,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
          className="mc-notify-list"
        >
          {filteredPayments.map((notification) => (
            <li
              className="mc-notify-item"
              key={notification.id}
              onClick={() => copyToClipboard(notification.pix)}
            >
              <AnchorComponent className="mc-notify-content">
                <div className="mc-notify-media">
                  <img src={notification.src} alt="alter" />
                  <i className={`material-iconss ${notification.status}`}>
                    campaign
                  </i>
                </div>
                <div
                  style={{
                    width: 350,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <small className="mc-notify-name">{notification.name}</small>
                  <small>Recebeu ultimo pagamento dia</small>
                  <small className="mc-notify-longmoment">
                    {notification.lastPayment}
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
                  <div style={{ width: 150 }}>
                    <small>{notification.value}</small>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: 190,
                      height: "auto",
                    }}
                  >
                    <small style={{ wordWrap: "break-word", maxWidth: 170 }}>
                      {notification.pix}
                    </small>
                  </div>
                  <div style={{ width: 175 }}>
                    <small>{notification.document}</small>
                  </div>
                  <div style={{ width: 108 }}>
                    <small>{notification.clients}</small>
                  </div>
                  <div style={{ width: 133 }}>
                    <small>{notification.lastPayment}</small>
                  </div>
                  <div>
                    <small>{notification.nextPayment}</small>
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
                  zIndex: 1,
                }}
              >
                <button
                  style={{ color: "#13cc13" }}
                  className="material-icons"
                  onClick={(event) => handleCheckClick(event, notification.id)}
                >
                  check
                </button>
                <button
                  style={{ color: "#ff0000" }}
                  className="material-icons"
                  onClick={(event) => handleCloseClick(event, notification.id)}
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
