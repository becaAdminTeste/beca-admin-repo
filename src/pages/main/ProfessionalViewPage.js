import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import BASE_URL from "../../config";
import { useAppContext } from "../../context/AppProvider";
import PageLayout from "../../layouts/PageLayout";

export default function ProfessionalViewPage() {
  const { token } = useAppContext();
  const { id } = useParams();
  const [user, setUser] = useState(undefined);
  console.log("🚀 ~ ProfessionalViewPage ~ user:", user);
  const [documents, setDocuments] = useState(undefined);
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userUrl = `${BASE_URL}/users/${id}`;
      const documentsUrl = `${BASE_URL}/users/${id}/documents`;
      const photoUrl = `${BASE_URL}/user/${id}/photo`;
      try {
        const { data: userData } = await axios.get(userUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { data: documentsData } = await axios.get(documentsUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { data: photoData } = await axios.get(photoUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profilePhoto = photoData.reverse()[0].path;
        setUser(userData);
        setDocuments(documentsData);
        setPhoto(profilePhoto);
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
          <h3 className="mc-breadcrumb-title">review do profissional</h3>
          <ul className="mc-breadcrumb-list">
            <li className="mc-breadcrumb-item">
              <Link to="#" className="mc-breadcrumb-link">
                inicio
              </Link>
            </li>
            <li className="mc-breadcrumb-item">
              <Link to="#" className="mc-breadcrumb-link">
                Profissionais
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
                <img width={300} height={600} src={photo} alt="profilePic"/>
              </div>
            ) : (
              <h3>Usuário sem foto</h3>
            )}
          </Col>
          <Col xl={7}>
            <h6 className="mc-divide-title">Detalhes do profissional</h6>
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
                <i style={{ width: 40 }} className="material-icons">
                  phone
                </i>
                <text style={{ width: 100 }}>Telefone</text>
                <text className="mc-product-view-meta">{user?.phone}</text>
              </li>
              <li className="mc-edit-card">
                <i style={{ width: 40 }} className="material-icons">
                  mail
                </i>
                <text style={{ width: 100 }}>E-Mail</text>
                <text className="mc-product-view-meta">{user?.email}</text>
              </li>
              <li className="mc-edit-card">
                <i style={{ width: 40 }} className="material-icons">
                  store
                </i>
                <text style={{ width: 100 }}>Trabalho</text>
                <text className="mc-product-view-meta">
                  {user?.address} {user?.number}, {user?.complement},{" "}
                  {user?.neighborhood}, {user?.city}/{user?.state},{" "}
                  {user?.zipCode}
                </text>
              </li>
              <li className="mc-edit-card">
                <i style={{ width: 40 }} className="material-icons">
                  summarize
                </i>
                <text style={{ width: 100 }}>Áreas</text>
                {/* {user.service?.map((service) => (
                  <div
                    className="mc-product-view-meta"
                    style={{ alignItems: "center", padding: 4, marginLeft: -3 }}
                  >

                      <ul>
                        <li>{service.serviceType.name}oi</li>
                      </ul>

                  </div>
                ))} */}
              </li>
              <li className="mc-edit-card">
                <i style={{ width: 40 }} className="material-icons">
                  pix
                </i>
                <text style={{ width: 100 }}>Chave Pix</text>
                <div style={{ maxWidth: 700 }}>
                  <small
                    style={{ wordWrap: "break-word" }}
                    className="mc-product-view-meta"
                  >
                    {user?.pix}
                  </small>
                </div>
              </li>
              <li className="mc-edit-card">
                <i style={{ width: 40 }} className="material-icons">
                  verified
                </i>
                <text style={{ width: 100 }}>Verificado</text>
                <text className="mc-product-view-meta">
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
          <Col xl={12}>
            <h6 className="mc-divide-title mt-5 mb-4">Documentos Enviados</h6>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
              }}
            >
              {documents ? (
                documents.map((doc) => (
                  <img width={500} height={400} src={doc.url} alt={doc.name} />
                ))
              ) : (
                <h3>oi</h3>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </PageLayout>
  );
}
