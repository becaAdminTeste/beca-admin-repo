import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import BASE_URL from "../../config";
import { useAppContext } from "../../context/AppProvider";
import PageLayout from "../../layouts/PageLayout";

export default function UserViewPage() {
  const { token } = useAppContext();
  const { id } = useParams();
  const [user, setUser] = useState(undefined);
  const [photo, setPhoto] = useState(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      const url = `${BASE_URL}/users/${id}`;
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { data: photoData } = await axios.get(
          `${BASE_URL}/user/${id}/photo`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const profilePic = photoData.reverse()?.[0]?.path;
        setPhoto(profilePic);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [id, token]);

  return (
    <PageLayout>
      <div className="mc-card mb-4">
        <div className="mc-breadcrumb">
          <h3 className="mc-breadcrumb-title">review do cliente</h3>
          <ul className="mc-breadcrumb-list">
            <li className="mc-breadcrumb-item">
              <Link to="/home" className="mc-breadcrumb-link">
                inicio
              </Link>
            </li>
            <li className="mc-breadcrumb-item">
              <Link to="/user-list" className="mc-breadcrumb-link">
                Usuários
              </Link>
            </li>
            <li className="mc-breadcrumb-item">Perfil</li>
          </ul>
        </div>
      </div>
      <div className="mc-card p-lg-4">
        <Row>
          <Col xl={5}>
            {photo ? (
              <div className="mc-product-view-gallery">
                <img src={photo} alt="profilePic" width={300} height={600} />
              </div>
            ) : (
              <h3>Usuário sem foto</h3>
            )}
          </Col>
          <Col xl={7}>
            <h6 className="mc-divide-title">Detalhes do cliente</h6>
            <h3 style={{ marginTop: 40, marginBottom: 39, marginLeft: 10 }}>
              {user?.name}
            </h3>
            <ul>
              <li className="mc-edit-card">
                <i style={{ width: 40 }} className="material-icons">
                  description
                </i>
                <span style={{ width: 100 }}>Nome</span>
                <text className="mc-product-view-meta">{user?.name}</text>
              </li>
              <li className="mc-edit-card">
                <i
                  style={{ width: 40, marginTop: -15 }}
                  className="material-icons"
                >
                  phone
                </i>
                <text style={{ width: 100, marginTop: -15 }}>Telefone</text>
                <text
                  style={{ marginTop: -15 }}
                  className="mc-product-view-meta"
                >
                  {user?.phone}
                </text>
              </li>
              <li className="mc-edit-card">
                <i
                  style={{ width: 40, marginTop: -30 }}
                  className="material-icons"
                >
                  mail
                </i>
                <text style={{ width: 100, marginTop: -30 }}>E-Mail</text>
                <text
                  style={{ marginTop: -30 }}
                  className="mc-product-view-meta"
                >
                  {user?.email}
                </text>
              </li>
              <li className="mc-edit-card">
                <i
                  style={{ width: 40, marginTop: -40 }}
                  className="material-icons"
                >
                  home
                </i>
                <text style={{ width: 100, marginTop: -40 }}>Residencia</text>
                <text
                  style={{ marginTop: -40 }}
                  className="mc-product-view-meta"
                >
                  {user?.address} {user?.number}, {user?.complement},{" "}
                  {user?.neighborhood}, {user?.city}/{user?.state},{" "}
                  {user?.zipCode}
                </text>
              </li>
              <li className="mc-edit-card">
                <i
                  style={{ width: 40, marginTop: -55 }}
                  className="material-icons"
                >
                  pix
                </i>
                <text style={{ width: 100, marginTop: -55 }}>Chave Pix</text>
                <div style={{ maxWidth: 700, marginTop: -55 }}>
                  <small
                    style={{ wordWrap: "break-word" }}
                    className="mc-product-view-meta"
                  >
                    {user?.pix}
                  </small>
                </div>
              </li>
              <li className="mc-edit-card">
                <i
                  style={{ width: 40, marginTop: -60 }}
                  className="material-icons"
                >
                  person_add
                </i>
                <text style={{ width: 100, marginTop: -60 }}>
                  Cód. Indicação
                </text>
                <text
                  style={{ marginTop: -60 }}
                  className="mc-product-view-meta"
                >
                  {user?.identifyCode}
                </text>
              </li>
              <li className="mc-edit-card">
                <i
                  style={{ width: 40, marginTop: -60 }}
                  className="material-icons"
                >
                  summarize
                </i>
                <text style={{ width: 100, marginTop: -60 }}>Indicações</text>
                <text
                  style={{ marginTop: -60 }}
                  className="mc-product-view-meta"
                >
                  {/* {value.indications.length} */}
                </text>
              </li>
              <li className="mc-edit-card">
                <i
                  style={{ width: 40, marginTop: -60 }}
                  className="material-icons"
                >
                  verified
                </i>
                <text style={{ width: 100, marginTop: -60 }}>Criado em</text>
                <text
                  className="mc-product-view-meta"
                  style={{ marginTop: -60 }}
                >
                  {user?.created_at &&
                    new Intl.DateTimeFormat("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      timeZone: "America/Sao_Paulo",
                    }).format(new Date(user.created_at))}
                </text>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    </PageLayout>
  );
}
