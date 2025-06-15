import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FloatCardComponent } from "../../components/cards";
import ProfessionalTableComponent from "../../components/tables/ProfessionalTableComponent";
import BASE_URL from "../../config";
import { useAppContext } from "../../context/AppProvider";
import PageLayout from "../../layouts/PageLayout";
import {
  activeStatusId,
  blockedStatusId,
  inactiveStatusId,
  pendingStatusId,
} from "../../utils";

export default function ProfessionalListPage() {
  const { token } = useAppContext();
  const [status, setStatus] = useState({
    actives: [],
    pending: [],
    blocked: [],
    inactive: [],
  });
  const [total, setTotal] = useState(0);
  const [professionals, setProfessionals] = useState([]);
  const [clientTypeId, setClientTypeId] = useState(null);

  useEffect(() => {
    const fetchClientTypeId = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/usertypes`, {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      if (!clientTypeId) return;

      try {
        const response = await axios.get(`${BASE_URL}/users?pageSize=99999`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.users || [];
        const filteredData = data.filter(
          (profissional) => profissional.userTypeId !== clientTypeId
        );
        setProfessionals(filteredData);

        const actives = filteredData.filter(
          (profissional) => profissional.statusId === activeStatusId
        ).length;
        const pending = filteredData.filter(
          (profissional) => profissional.statusId === pendingStatusId
        ).length;
        const blocked = filteredData.filter(
          (profissional) => profissional.statusId === blockedStatusId
        ).length;
        const inactive = filteredData.filter(
          (profissional) => profissional.statusId === inactiveStatusId
        ).length;

        setStatus({
          actives: filteredData.filter(
            (profissional) => profissional.statusId === activeStatusId
          ),
          pending: filteredData.filter(
            (profissional) => profissional.statusId === pendingStatusId
          ),
          blocked: filteredData.filter(
            (profissional) => profissional.statusId === blockedStatusId
          ),
          inactive: filteredData.filter(
            (profissional) => profissional.statusId === inactiveStatusId
          ),
        });
        setTotal(actives + pending + blocked + inactive);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [clientTypeId]);

  const actives = status.actives.length;
  const pending = status.pending.length;
  const blocked = status.blocked.length;
  const inactive = status.inactive.length;

  const cards = [
    {
      title: "Total de Profissionais",
      digit: total,
      icon: "pending",
      variant: "lg blue",
    },
    {
      title: "Profissionais Ativos",
      digit: actives,
      icon: "check_circle",
      variant: "lg green",
    },
    {
      title: "Profissionais Pendentes",
      digit: pending,
      icon: "pending",
      variant: "lg purple",
    },
    {
      title: "Profissionais Inativos / Bloqueados",
      digit: blocked + inactive,
      icon: "remove_circle",
      variant: "lg red",
    },
  ];

  return (
    <PageLayout>
      <Row>
        <Col xl={12}>
          <div className="mc-card">
            <div className="mc-breadcrumb">
              <h3 className="mc-breadcrumb-title">Profissionais</h3>
              <ul className="mc-breadcrumb-list">
                <li className="mc-breadcrumb-item">
                  <Link to="/home" className="mc-breadcrumb-link">
                    Inicio
                  </Link>
                </li>
                <li className="mc-breadcrumb-item">Lista de profissionais</li>
              </ul>
            </div>
          </div>
        </Col>

        {cards.map((float, index) => (
          <Col xl={3} key={index}>
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
              <h4 className="mc-card-title">Lista de profissionais</h4>
            </div>
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
              tbody={professionals}
              total={total}
            />
          </div>
        </Col>
      </Row>
    </PageLayout>
  );
}
