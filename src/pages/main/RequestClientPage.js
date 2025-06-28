import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../../config";
import PageLayout from "../../layouts/PageLayout";

export default function RequestClientPage() {
  const [payments, setPayments] = useState([]);

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

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/payment/by-indication`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPayments(response.data);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    }
  };

  const handleCheckClick = async (userId) => {
    const response = await axios.post(
      `${BASE_URL}/payment/update-by-indicator/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    if (response.status === 200) {
      fetchData();
      alert("Status atualizado com sucesso!");
      return;
    }

    alert("Ocorreu um erro ao atualizar o status, tente novamente mais tarde.");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageLayout>
      <div className="mc-card">
        <div className="mc-breadcrumb">
          <h3 className="mc-breadcrumb-title">Solicitações Saque</h3>
          <ul className="mc-breadcrumb-list">
            <li className="mc-breadcrumb-item">
              <Link to="/home" className="mc-breadcrumb-link">
                Início
              </Link>
            </li>
            <li className="mc-breadcrumb-item">Solicitações</li>
          </ul>
        </div>
      </div>

      <div className="mc-card" style={{ height: "70vh" }}>
        <div className="mc-card-header">
          <h4 className="mc-card-title">Solicitações de profissionais</h4>
        </div>

        <div style={{ overflowX: "auto", height: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `
                minmax(200px, 2fr)
                minmax(100px, 1fr)
                minmax(150px, 1.5fr)
                minmax(150px, 2fr)
                auto
              `,
              minWidth: 1000,
              fontWeight: "bold",
              padding: "0 12px",
              gap: 12,
              marginTop: 12,
            }}
          >
            <h4>Nome</h4>
            <h4>Total</h4>
            <h4>Documento</h4>
            <h4>Pix</h4>
            <div />
          </div>

          <ul
            style={{
              backgroundColor: "#e6e6e61a",
              borderRadius: 8,
              marginTop: 10,
              padding: 0,
              minWidth: 1000,
            }}
            className="mc-notify-list"
          >
            {payments.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center" }}>
                Nenhum item encontrado.
              </div>
            ) : (
              payments.map((payment) => (
                <li
                  className="mc-notify-item"
                  key={payment.lawyerId}
                  onClick={() => copyToClipboard(payment.pix)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `
                      minmax(200px, 2fr)
                      minmax(100px, 1fr)
                      minmax(150px, 1.5fr)
                      minmax(150px, 2fr)
                      auto
                    `,
                    padding: "16px 12px",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <small>{payment.userName}</small>
                  <small>{payment.totalFormatted}</small>
                  <small>{payment.document}</small>
                  <small style={{ wordBreak: "break-word" }}>
                    {payment.pix}
                  </small>
                  <div>
                    <button
                      style={{ color: "#13cc13" }}
                      className="material-icons"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCheckClick(payment.userId);
                      }}
                    >
                      check
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
