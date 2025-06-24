import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../../config";
import PageLayout from "../../layouts/PageLayout";

export default function RequestProfessionalPage() {
  const [payments, setPayments] = useState([]);

  function formatDateToBR(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // meses começam em 0
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  }

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
      const response = await axios.get(`${BASE_URL}/payment/pending-summary`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPayments(response.data);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    }
  };

  const handleCheckClick = async (lawyer_id) => {
    const response = await axios.post(
      `${BASE_URL}/payment/update-by-lawyer/${lawyer_id}`,
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
      <div className="mc-card ">
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
          <h4 className="mc-card-title">Todas Solicitações de profissionais</h4>
        </div>

        <div style={{ overflowX: "auto", height: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `
              minmax(180px, 1.5fr)
              minmax(100px, 1.25fr)
              minmax(150px, 1.5fr)
              minmax(120px, 1.5fr)
              minmax(80px, 1fr)
              minmax(120px, 1.5fr)
              minmax(120px, 1.5fr)
              auto
            `,
              minWidth: 1200,
              fontWeight: "bold",
              padding: "0 12px",
              gap: 12,
              marginTop: 12,
            }}
          >
            <h4>Nome Usuário</h4>
            <h4>Valor Total</h4>
            <h4>Chave Pix</h4>
            <h4>Documento</h4>
            <h4>Serviços</h4>
            <h4>Último Pag.</h4>
            <h4>Próximo Pag.</h4>
            <div />
          </div>

          <ul
            style={{
              backgroundColor: "#e6e6e61a",
              borderRadius: 8,
              marginTop: 10,
              padding: 0,
              minWidth: 1200,
            }}
            className="mc-notify-list"
          >
            {payments.map((payment) => (
              <li
                className="mc-notify-item"
                key={payment.lawyerId}
                onClick={() => copyToClipboard(payment.lawyerPix)}
                style={{
                  display: "grid",
                  gridTemplateColumns: `
                  minmax(180px, 2fr)
                  minmax(100px, 1fr)
                  minmax(150px, 2fr)
                  minmax(120px, 1.5fr)
                  minmax(80px, 1fr)
                  minmax(120px, 1.5fr)
                  minmax(120px, 1.5fr)
                  auto
                `,
                  padding: "16px 12px",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <small>{payment.lawyerName}</small>
                <small>{payment.totalAmount}</small>
                <small style={{ wordBreak: "break-word" }}>
                  {payment.lawyerPix}
                </small>
                <small>{payment.document}</small>
                <small>{payment.totalService}</small>
                <small>{formatDateToBR(payment.lastUpdate)}</small>
                <small>{formatDateToBR(payment.nextUpdate)}</small>
                <div style={{ display: "flex", gap: 16 }}>
                  <button
                    style={{ color: "#13cc13" }}
                    className="material-icons"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCheckClick(payment.lawyerId);
                    }}
                  >
                    check
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
