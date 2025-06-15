import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { Link, useParams } from "react-router-dom";
import { AnchorComponent } from "../../components/elements";
import Input from "../../components/input";
import BASE_URL from "../../config";
import { useAppContext } from "../../context/AppProvider";
import PageLayout from "../../layouts/PageLayout";

export default function ProfessionalEditPage() {
  const { token } = useAppContext();
  const { id } = useParams();
  const [user, setUser] = useState(undefined);
  const [userPhoto, setUserPhoto] = useState(undefined);
  console.log("🚀 ~ ProfessionalEditPage ~ user:", user);
  const [homeCep, setHomeCep] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertModal, setAlertModal] = React.useState(false);
  const [documents, setDocuments] = useState(undefined);

  const handlehomeCepSearch = () => {
    const url = `https://brasilapi.com.br/api/cep/v1/${homeCep}`;
    setIsLoading(true);
    axios
      .get(url)
      .then((response) => {
        if (response.status === 200) {
          setUser({
            ...user,
            address: response.data.street,
            neighborhood: response.data.neighborhood,
            state: response.data.state,
            city: response.data.city,
            zipCode: response.data.cep,
          });
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        alert(
          "Ocorreu um erro ao tentar buscar o cep por favor tente novamente mais tarde"
        );
        console.log(error);
      });
  };

  const handleUpdateUser = async () => {
    const url = `${BASE_URL}/user/${id}`;
    try {
      const response = await axios.put(url, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 204) {
        setAlertModal(true);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      alert(
        "Ocorreu um erro ao tentar atualizar o usuário, por favor tente novamente mais tarde"
      );
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const url = `${BASE_URL}/users/${id}`;
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const getPhoto = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/${id}/photo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { data: documentsData } = await axios.get(
          `${BASE_URL}/users/${id}/documents`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const profilePic = response.data.reverse()[0].path;
        setDocuments(documentsData);
        setUserPhoto(profilePic);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getPhoto();
    fetchUserData();
  }, [id, token]);

  return (
    <PageLayout>
      <div className="mc-card mb-4">
        <div className="mc-breadcrumb">
          <h3 className="mc-breadcrumb-title">Edição do profissional</h3>
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
      <div className="mc-card-edit p-lg-4">
        <Row>
          <Col xl={5}>
            <div className="mc-product-view-gallery">
              <img src={userPhoto} width={300} height={600} alt="foto" />
            </div>
          </Col>
          <Col xl={7}>
            <h6 className="mc-divide-title">Detalhes do profissional</h6>
            <h3 style={{ marginTop: 40, marginBottom: 39, marginLeft: 10 }}>
              {user?.name}
            </h3>
            <ul>
              <Input
                icon="description"
                title="Nome"
                value={user?.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
              <Input
                icon="phone"
                title="Telefone"
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                value={user?.phone}
              />
              <Input
                icon="mail"
                title="E-Mail"
                onChange={(e) => setUser({ ...user, mail: e.target.value })}
                value={user?.email}
              />
              <Input
                title={"CEP"}
                icon="home"
                isZipCode={true}
                onChange={(e) => setHomeCep(e.target.value)}
                value={!homeCep ? user?.zipCode : homeCep}
                onClick={handlehomeCepSearch}
              />
              <Input
                title="Rua"
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                value={isLoading ? "Carregando..." : user?.address}
              />
              <Input
                title="Numero"
                onChange={(e) => setUser({ ...user, number: e.target.value })}
                value={user?.number}
              />
              <Input
                title="Complemento"
                onChange={(e) =>
                  setUser({ ...user, complement: e.target.value })
                }
                value={user?.complement}
              />
              <Input
                title="Bairro"
                onChange={(e) =>
                  setUser({ ...user, neighborhood: e.target.value })
                }
                value={user?.neighborhood}
              />
              <Input
                title="UF"
                onChange={(e) => setUser({ ...user, state: e.target.value })}
                value={user?.state}
              />
              <Input
                title="Cidade"
                onChange={(e) => setUser({ ...user, city: e.target.value })}
                value={user?.city}
              />

              <li className="mc-edit-card">
                <i style={{ width: 40 }} className="material-icons">
                  summarize
                </i>
                <text style={{ width: 100 }}>Áreas</text>
                {user?.areas?.map((area) => (
                  <div
                    className="mc-product-view-meta"
                    style={{ alignItems: "center", padding: 4, marginLeft: -3 }}
                  >
                    {area && (
                      <ul>
                        <li>{area}</li>
                      </ul>
                    )}
                  </div>
                ))}
              </li>
              <Input
                icon="pix"
                title="Chave Pix"
                onChange={(e) => setUser({ ...user, pix: e.target.value })}
                value={user?.pix}
              />
              <Input
                icon="pix"
                title="Verificado"
                onChange={(e) => setUser({ ...user, verified: e.target.value })}
                value={user?.verified}
              />
            </ul>
            <div
              style={{
                position: "relative",
                marginLeft: "25.8%",
                marginTop: 30,
              }}
            >
              <AnchorComponent
                className="mc-btns"
                type="button"
                onClick={handleUpdateUser}
                style={{ width: 100, height: 40, padding: 10 }}
              >
                Salvar
              </AnchorComponent>
            </div>
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
              {documents?.map((doc) => (
                <img width={500} height={300} src={doc.url} alt={doc.name} />
              ))}
            </div>
          </Col>
        </Row>
        <Modal show={alertModal} onHide={() => setAlertModal(false)}>
          <div className="mc-alert-modal">
            <i className="material-icons" style={{ color: "green" }}>
              verified
            </i>
            <h3>Profissional alterado com sucesso</h3>
            <Modal.Footer>
              <AnchorComponent
                type="button"
                to="/professional-list"
                onClick={() => setAlertModal(false)}
                style={{
                  width: 200,
                  height: 40,
                  padding: 10,
                  backgroundColor: "#1E66FF",
                  borderRadius: 20,
                  fontWeight: "700",
                }}
              >
                Voltar a Profissionais
              </AnchorComponent>
            </Modal.Footer>
          </div>
        </Modal>
      </div>
    </PageLayout>
  );
}
