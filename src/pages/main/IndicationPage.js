import * as Tooltip from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppProvider";
import PageLayout from "../../layouts/PageLayout";
import api from "../../routes/api";

export default function NotificationPage() {
  const [users, setUsers] = useState([]);
  const { token } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/users/indications/sumary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <PageLayout>
      <div className="mc-card">
        <div className="mc-breadcrumb">
          <h3 className="mc-breadcrumb-title">Indicações</h3>
          <ul className="mc-breadcrumb-list">
            <li className="mc-breadcrumb-item">
              <Link to="/home" className="mc-breadcrumb-link">
                Início
              </Link>
            </li>
            <li className="mc-breadcrumb-item">Indicações</li>
          </ul>
        </div>
      </div>

      <div className="mc-card" style={{ height: "70vh" }}>
        <div className="mc-card-header">
          <h4 className="mc-card-title">Todas Indicações</h4>
        </div>

        <div style={{ overflowX: "auto", height: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `
                minmax(220px, 1.5fr)
                minmax(280px, 2fr)
                minmax(140px, 1fr)
              `,
              minWidth: 800,
              fontWeight: "bold",
              padding: "0 12px",
              gap: 12,
              marginTop: 12,
            }}
          >
            <h4>Nome Usuário</h4>
            <h4>Clientes Indicados</h4>
            <h4>Código</h4>
          </div>

          <ul
            className="mc-notify-list"
            style={{
              backgroundColor: "#e6e6e61a",
              borderRadius: 8,
              marginTop: 10,
              padding: 0,
              minWidth: 800,
            }}
          >
            {users.map((user, index) => (
              <li
                className="mc-notify-item"
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: `
        minmax(220px, 1.5fr)
        minmax(280px, 2fr)
        minmax(140px, 1fr)
      `,
                  gap: 12,
                  alignItems: "center",
                  padding: "16px 12px",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{user.name}</div>

                <Tooltip.Provider delayDuration={300}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <div
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          cursor: "default",
                        }}
                      >
                        {user.indicatedUsers.join(", ")}
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        sideOffset={5}
                        style={{
                          backgroundColor: "#333",
                          color: "#fff",
                          padding: "8px 10px",
                          borderRadius: 4,
                          fontSize: 14,
                          maxWidth: 300,
                          whiteSpace: "pre-wrap",
                          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                        }}
                      >
                        {user.indicatedUsers.join(", ")}
                        <Tooltip.Arrow style={{ fill: "#333" }} />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>

                <div style={{ fontWeight: "bold" }}>{user.code}</div>
              </li>
            ))}

            {users.length === 0 && (
              <li style={{ padding: 16, textAlign: "center", width: "100%" }}>
                Nenhuma indicação encontrada.
              </li>
            )}
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
