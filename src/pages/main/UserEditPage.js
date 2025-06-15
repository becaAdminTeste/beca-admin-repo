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

export default function UserEditPage() {
  const { token } = useAppContext();
  const { id } = useParams();
  const [user, setUser] = useState(undefined);
  const [homeCep, setHomeCep] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertModal, setAlertModal] = React.useState(false);
  const [photo, setPhoto] = useState("");

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
      try {
        const { data: userData } = await axios.get(`${BASE_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { data: photoData } = await axios.get(
          `${BASE_URL}/user/${id}/photo`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const profilePhoto = photoData.reverse()[0].path;
        setPhoto(profilePhoto);
        setUser(userData);
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
          <h3 className="mc-breadcrumb-title">Edição do cliente</h3>
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
            <div className="mc-product-view-gallery">
              <img width={300} height={600} src={photo} alt="foto" />
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
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                value={user?.name}
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
                icon="home"
                title="CEP"
                onChange={(e) => setUser({ ...user, zipCode: e.target.value })}
                value={user?.zipCode}
              />
              <Input
                title="Rua"
                onChange={(e) => setUser({ ...user, mail: e.target.value })}
                value={user?.email}
              />
              <Input
                title="Número"
                onChange={(e) => setUser({ ...user, mail: e.target.value })}
                value={user?.email}
              />
              <Input
                title="Complemento"
                onChange={(e) => setUser({ ...user, mail: e.target.value })}
                value={user?.email}
              />
              <Input
                title="Bairro"
                onChange={(e) => setUser({ ...user, mail: e.target.value })}
                value={user?.email}
              />
              <Input
                title="UF"
                onChange={(e) => setUser({ ...user, mail: e.target.value })}
                value={user?.email}
              />
              <Input
                title="Cidade"
                onChange={(e) => setUser({ ...user, mail: e.target.value })}
                value={user?.email}
              />
              <Input
                icon="pix"
                title=""
                onChange={(e) => setUser({ ...user, mail: e.target.value })}
                value={user?.email}
              />
              <Input
                icon="person_add"
                title=""
                onChange={(e) => setUser({ ...user, mail: e.target.value })}
                value={user?.email}
              />
              <Input
                icon="verified"
                title=""
                onChange={(e) => setUser({ ...user, mail: e.target.value })}
                value={user?.email}
              />

      
    
 
     
              <li className="mc-edit-card">
                <i style={{ width: 40 }} className="material-icons"></i>
                <span style={{ width: 100 }}>UF</span>
                <input
                  disabled
                  style={{
                    width: 450,
                    backgroundColor: "#FFF",
                    height: 30,
                    borderRadius: 8,
                    padding: 10,
                    border: "1px solid black",
                    color: "black",
                  }}
                  value={isLoading ? "Carregando..." : user?.state}
                />
              </li>
              <li className="mc-edit-card">
                <i
                  style={{
                    width: 40,
                    borderLeftWidth: 10,
                    borderColor: "#FFF",
                  }}
                  className="material-icons"
                >
                  {" "}
                </i>
                <span style={{ width: 100 }}>Cidade</span>
                <input
                  disabled
                  style={{
                    width: 450,
                    backgroundColor: "#FFF",
                    height: 30,
                    borderRadius: 8,
                    padding: 10,
                    border: "1px solid black",
                    color: "black",
                  }}
                  value={isLoading ? "Carregando..." : user?.city}
                />
              </li>
              <li className="mc-edit-card">
                <i style={{ width: 40 }} className="material-icons">
                  pix
                </i>
                <text style={{ width: 100 }}>Chave Pix</text>
                <div style={{ maxWidth: 700 }}>
                  <input
                    style={{
                      width: 450,
                      backgroundColor: "#FFF",
                      height: 30,
                      borderRadius: 8,
                      padding: 10,
                      border: "1px solid black",
                      color: "black",
                    }}
                    onChange={(e) => setUser({ ...user, pix: e.target.value })}
                    value={user?.pix}
                  />
                </div>
              </li>
              <li className="mc-edit-card">
                <i style={{ width: 40 }} className="material-icons">
                  person_add
                </i>
                <text style={{ width: 100 }}>Cód. Indicação</text>
                <input
                  style={{
                    width: 450,
                    backgroundColor: "#FFF",
                    height: 30,
                    borderRadius: 8,
                    padding: 10,
                    border: "1px solid black",
                    color: "black",
                  }}
                  onChange={(e) => setUser({ ...user, code: e.target.value })}
                  value={user?.identifyCode}
                />
              </li>
              <li className="mc-edit-card">
                <i style={{ width: 40 }} className="material-icons">
                  verified
                </i>
                <text style={{ width: 100 }}>Criado em</text>
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
            </ul>
          </Col>
        </Row>
      </div>
      <Modal show={alertModal} onHide={() => setAlertModal(false)}>
        <div className="mc-alert-modal">
          <i className="material-icons" style={{ color: "green" }}>
            verified
          </i>
          <h3>Usuário alterado com sucesso</h3>
          <Modal.Footer>
            <AnchorComponent
              type="button"
              to="/user-list"
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
              Voltar a Usuários
            </AnchorComponent>
          </Modal.Footer>
        </div>
      </Modal>
    </PageLayout>
  );
}
