import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FloatCardComponent } from "../../components/cards";
import UsersTableComponent from "../../components/tables/UsersTableComponent";
import BASE_URL from "../../config";
import PageLayout from "../../layouts/PageLayout";
import { activeStatusId, blockedStatusId, inactiveStatusId } from "../../utils";

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [clientTypeId, setClientTypeId] = useState(null);

  useEffect(() => {
    const fetchClientTypeId = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/usertypes`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const userTypes = response.data;
        const clientType = userTypes.find((type) => type.name === "Cliente");
        if (clientType) {
          setClientTypeId(clientType.id);
        }
      } catch (error) {
        console.error("Error fetching user types:", error);
      }
    };

    fetchClientTypeId();
  }, []);

  useEffect(() => {
    const fetchStatuses = async () => {
      if (!clientTypeId) return;

      try {
        const usersResponse = await axios.get(`${BASE_URL}/users?pageSize=99999`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const fetchedUsers = usersResponse.data.users;
        setUsers(fetchedUsers);

        const actives = fetchedUsers.filter(
          (user) =>
            user.statusId === activeStatusId && user.userTypeId === clientTypeId
        ).length;
        const blocked = fetchedUsers.filter(
          (user) =>
            user.statusId === blockedStatusId &&
            user.userTypeId === clientTypeId
        ).length;
        const inactive = fetchedUsers.filter(
          (user) =>
            user.statusId === inactiveStatusId &&
            user.userTypeId === clientTypeId
        ).length;

        const total = actives + blocked + inactive;

        setUsuarios([
          {
            title: "Total de Clientes",
            digit: total,
            icon: "pending",
            variant: "lg blue",
          },
          {
            title: "Clientes Ativos",
            digit: actives,
            icon: "check_circle",
            variant: "lg green",
          },
          {
            title: "Clientes Inativos / Bloqueados",
            digit: blocked + inactive,
            icon: "remove_circle",
            variant: "lg red",
          },
        ]);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchStatuses();
  }, [clientTypeId]);

  return (
    <PageLayout>
      <Row>
        <Col xl={12}>
          <div className="mc-card">
            <div className="mc-breadcrumb">
              <h3 className="mc-breadcrumb-title">Clientes</h3>
              <ul className="mc-breadcrumb-list">
                <li className="mc-breadcrumb-item">
                  <Link to="#" className="mc-breadcrumb-link">
                    Inicio
                  </Link>
                </li>
                <li className="mc-breadcrumb-item">Lista de clientes</li>
              </ul>
            </div>
          </div>
        </Col>
        {usuarios.map((float, index) => (
          <Col xl={4} key={index}>
            <FloatCardComponent
              variant={float.variant}
              digit={float.digit}
              title={float.title}
              icon={float.icon}
            />
          </Col>
        ))}
        <Col xl={12}>
          <div className="mc-card">
            <div className="mc-card-header">
              <h4 className="mc-card-title">Usuários</h4>
            </div>
            <UsersTableComponent
              thead={[
                "Nome",
                "Função",
                "Documento",
                "Email",
                "Chave Pix",
                "UF",
                "Telefone",
                "Status",
                "Criado em",
                "Ação",
              ]}
              tbody={users}
              total={users.length}
            />
          </div>
        </Col>
      </Row>
    </PageLayout>
  );
}
