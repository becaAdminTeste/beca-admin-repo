import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import specific from "../../assets/data/specifics.json";
import {
  EcommerceCardComponent,
  SalesCardComponent,
} from "../../components/cards";
import ProfessionalTableComponent from "../../components/tables/ProfessionalTableComponent";
import UsersTableComponent from "../../components/tables/UsersTableComponent";
import BASE_URL from "../../config";
import PageLayout from "../../layouts/PageLayout";
import { activeStatusId } from "../../utils";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [payments, setpayments] = useState([]);
  const INITIAL_USER_TYPES = {
    cli: "",
    adv: "",
    dev: "",
    inf: "",
    adm: "",
  };
  const [userTypes, setUserTypes] = useState(INITIAL_USER_TYPES);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserTypes = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/usertypes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const validTypes = response.data.reduce(
        (acc, type) => {
          // eslint-disable-next-line default-case
          switch (type.name) {
            case "Advogado":
              acc.adv = type.id;
              break;
            case "Cliente":
              acc.cli = type.id;
              break;
            case "Influenciador":
              acc.inf = type.id;
              break;
            case "Administrador":
              acc.adm = type.id;
              break;
          }
          return acc;
        },
        { ...INITIAL_USER_TYPES }
      );
      setUserTypes(validTypes);
    } catch (error) {
      console.error("Error fetching user types:", error);
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/payments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setpayments(response.data);
    } catch (error) {
      console.error("Error fetching user types:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const usersResponse = await axios.get(
        `${BASE_URL}/users?pageSize=99999`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers(usersResponse.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const totalUsers = useMemo(
    () =>
      Array.isArray(users)
        ? users.filter((user) => user.userTypeId === userTypes.cli)
        : [],
    [users, userTypes.cli]
  );

  const totalProfessionals = useMemo(
    () =>
      users.filter((professional) => professional.userTypeId === userTypes.adv),
    [users, userTypes.adv]
  );

  const activeUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.statusId === activeStatusId && user.userTypeId === userTypes.cli
      ),
    [users, userTypes.cli]
  );

  const activeProfessionals = useMemo(
    () =>
      specific.filter(
        (professional) =>
          professional.statusId === activeStatusId &&
          professional.userTypeId === userTypes.adv
      ),
    [userTypes.adv]
  );



  useEffect(() => {
    Promise.all([fetchUserTypes(), fetchUsers(), fetchPayments()]);
  }, [fetchUserTypes, fetchUsers, fetchPayments]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Row>
        <Col xl={12}>
          <div className="mc-card">
            <div className="mc-breadcrumb">
              <h3 className="mc-breadcrumb-title">Inicio</h3>
              <ul className="mc-breadcrumb-list">
                <li className="mc-breadcrumb-item">Inicio</li>
                <li className="mc-breadcrumb-item">
                  <Link to="/home" className="mc-breadcrumb-link">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </Col>
        <Col xs={12} xl={8}>
          <Row xs={1} sm={2}>
            <Col>
              <EcommerceCardComponent
                icon={"account_circle"}
                trend={"trending_up"}
                title={"Total de Usuários"}
                variant={"blue"}
                number={totalUsers.length}
                percent={0}
              />
              <EcommerceCardComponent
                icon={"contact_mail"}
                trend={"trending_up"}
                title={"Total de Profissionais"}
                variant={"green"}
                number={totalProfessionals.length}
                percent={0}
              />
            </Col>
            <Col>
              <EcommerceCardComponent
                icon={"shopping_bag"}
                trend={"trending_up"}
                title={"Total de Serviços"}
                variant={"purple"}
                number={payments.filter((pay) => (pay.status === "Ativo")).length}
                percent={0}
              />
              <EcommerceCardComponent
                icon={"hotel_class"}
                trend={"trending_up"}
                title={"Total de Indicações"}
                variant={"yellow"}
                number={0}
                percent={0}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12} xl={4}>
          <SalesCardComponent />
        </Col>
        <div style={{ padding: "20px 12px", fontWeight: "bold", fontSize: 20 }}>
          Últimos 5 Profissionais Cadastrados
        </div>
        <Col xl={12}>
          <ProfessionalTableComponent
            thead={[
              "Nome",
              "Função",
              "Documento",
              "Email",
              "Clientes",
              "UF",
              "Telefone",
              "Status",
              "Criado em",
              "Ação",
            ]}
            tbody={users}
            total={5}
          />
        </Col>
        <div style={{ padding: "20px 12px", fontWeight: "bold", fontSize: 20 }}>
          Últimos 5 Clientes Cadastrados
        </div>
        <Col xl={12}>
          <UsersTableComponent
            thead={[
              "Nome",
              "Função",
              "Documento",
              "Email",
              "Chave pix",
              "UF",
              "Telefone",
              "Status",
              "Criado em",
              "Ação",
            ]}
            tbody={users}
            total={5}
          />
        </Col>
      </Row>
    </PageLayout>
  );
}
