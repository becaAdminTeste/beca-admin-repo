import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AnchorComponent } from "../../components/elements";
import BASE_URL from "../../config";
import PageLayout from "../../layouts/PageLayout";
import { cnpj, cpf, phoneMask, validateEmail } from "../../utils";

export default function CreateUsers() {
  const [homeCep, setHomeCep] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isValidEmail, setIsValidEmail] = useState(null);
  const [areas, setAreas] = useState([]);
  const [selectedTypeName, setSelectedTypeName] = useState({
    id: "",
    name: "",
  });
  const [realValue, setRealValue] = useState({
    id: "",
    email: "",
    name: "",
    password: "",
    phone: "",
    identifyCode: "",
    indicationcode: "",
    zipCode: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    birth: "",
    city: "",
    state: "",
    country: "",
    oab: "",
    created_at: "",
    updated_at: "",
    deleted_at: "",
    userTypeId: "",
    pix: "",
    pixTypeId: "",
    statusId: "",
    taxId: "",
    services: [],
  });

  const handleClearField = () => {
    setRealValue({
      id: "",
      email: "",
      name: "",
      password: "",
      phone: "",
      identifyCode: "",
      indicationcode: "",
      zipCode: homeCep,
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      birth: "",
      city: "",
      state: "",
      country: "Brasil",
      oab: "",
      created_at: "",
      updated_at: "",
      deleted_at: null,
      userTypeId: "",
      pix: "",
      pixTypeId: "",
      statusId: "",
      taxId: "",
      services: [],
      documents: [],
    });
    setSelectedTypeName({
      id: "",
      name: "",
    });
    setHomeCep(null);
  };

  function DocumentMask(value) {
    if (value.length < 15) return cpf(value);
    else return cnpj(value);
  }

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setIsValidEmail(validateEmail(email));
    setRealValue({ ...realValue, email: email });
  };

  const handleGetAreasType = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/service-type`);
      setAreas(response.data);
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  };

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/usertypes`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setType(response.data);
      } catch (error) {
        console.error("Erro ao fazer a chamada GET:", error);
      }
      const fetchStatuses = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/status`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setStatuses(response.data.status);
        } catch (error) {
          console.error("Error fetching statuses:", error);
        }
      };
      fetchStatuses();
    };
    handleGetAreasType();
    fetchUserTypes();
  }, []);

  const handleStatusChange = (event) => {
    setRealValue({ ...realValue, statusId: event.target.value });
  };

  const fileInputRef = useRef(null);

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    setRealValue({ ...realValue, userTypeId: selectedId });

    const selectedType = type.find((t) => t.id === selectedId);
    setSelectedTypeName({
      id: selectedType ? selectedType.id : "",
      name: selectedType ? selectedType.name : "",
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRealValue({ ...realValue, src: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentsChange = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = [...realValue.documents];

    files.forEach((file) => {
      newDocuments.push(URL.createObjectURL(file));
    });

    setRealValue({ ...realValue, taxId: newDocuments });
  };

  const handleChooseAnotherImage = () => {
    setRealValue({ ...realValue, src: "" });
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/accounts`, realValue, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handlehomeCepSearch = () => {
    const url = `https://brasilapi.com.br/api/cep/v1/${homeCep}`;
    setIsLoading(true);
    axios
      .get(url)
      .then((response) => {
        if (response.status === 200) {
          setRealValue({
            ...realValue,
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
  return (
    <PageLayout>
      <div className="mc-card mb-4">
        <div className="mc-breadcrumb">
          <h3 className="mc-breadcrumb-title">
            Criação de Usuários / Profissionais
          </h3>
          <ul className="mc-breadcrumb-list">
            <li className="mc-breadcrumb-item">
              <Link to="#" className="mc-breadcrumb-link">
                Inicio
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
          {selectedTypeName.name !== "" && (
            <Col xl={5}>
              <div
                className="mc-product-view-gallery"
                style={{ width: 600, height: 700, overflow: "hidden" }}
              >
                {realValue.src ? (
                  <>
                    <img
                      src={realValue.src}
                      alt="product"
                      style={{ maxWidth: "100%", maxHeight: 600 }}
                    />
                    <button
                      style={{
                        width: "100%",
                        height: 40,
                        marginTop: 10,
                        borderRadius: 8,
                        backgroundColor: "blue",
                        color: "white",
                        cursor: "pointer",
                        border: "none",
                      }}
                      onClick={handleChooseAnotherImage}
                    >
                      Escolher outra imagem
                    </button>
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      height: "100%",
                      border: "2px dashed blue",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      id="file-input"
                      type="file"
                      achomeCept="image/*"
                      style={{
                        opacity: 0,
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                      }}
                      onChange={handleProfilePictureChange}
                    />
                    <button
                      style={{
                        width: 100,
                        height: 100,
                        border: "2px dashed blue",
                        borderRadius: 20,
                        background: "none",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 50,
                        color: "blue",
                      }}
                      onClick={handleChooseAnotherImage}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </Col>
          )}
          <Col xl={7}>
            {selectedTypeName.name === "" ? (
              <select
                defaultValue={""}
                onChange={handleSelectChange}
                style={{
                  width: 250,
                  height: 40,
                  backgroundColor: "#FFF",
                  borderRadius: 6,
                  color: "black",
                }}
              >
                <option value="" disabled>
                  Selecione um tipo de Usuário
                </option>
                {type
                  .filter((types) => types.name !== "Administrador")
                  ?.map((filteredType) => (
                    <option key={filteredType.id} value={filteredType.id}>
                      {filteredType.name}
                    </option>
                  ))}
              </select>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: 500,
                  justifyContent: "space-between",
                }}
              >
                <h3>{selectedTypeName.name}</h3>
                <button
                  onClick={handleClearField}
                  style={{
                    width: 200,
                    height: 30,
                    backgroundColor: "blue",
                    borderRadius: 8,
                  }}
                >
                  <h6 style={{ fontWeight: 700 }}>Trocar tipo do usuário</h6>
                </button>
              </div>
            )}
            {selectedTypeName.name === "Cliente" && (
              <div>
                <h6 className="mc-divide-title">Detalhes do profissional</h6>
                <h3 style={{ marginTop: 40, marginBottom: 39, marginLeft: 10 }}>
                  {realValue?.name}
                </h3>
                <ul>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      person
                    </i>
                    <span style={{ width: 100 }}>Nome</span>
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
                      onChange={(e) =>
                        setRealValue({ ...realValue, name: e.target.value })
                      }
                      value={realValue.name}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      phone
                    </i>
                    <span style={{ width: 100 }}>Telefone</span>
                    <input
                      maxLength={15}
                      style={{
                        width: 450,
                        backgroundColor: "#FFF",
                        height: 30,
                        borderRadius: 8,
                        padding: 10,
                        border: "1px solid black",
                        color: "black",
                      }}
                      onChange={(e) =>
                        setRealValue({
                          ...realValue,
                          phone: phoneMask(e.target.value),
                        })
                      }
                      value={realValue.phone}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      description
                    </i>
                    <span style={{ width: 100 }}>Documento</span>
                    <input
                      maxLength={14}
                      style={{
                        width: 450,
                        backgroundColor: "#FFF",
                        height: 30,
                        borderRadius: 8,
                        padding: 10,
                        border: "1px solid black",
                        color: "black",
                      }}
                      onChange={(e) =>
                        setRealValue({
                          ...realValue,
                          taxId: DocumentMask(e.target.value),
                        })
                      }
                      value={realValue.taxId}
                    />
                  </li>
                  <li
                    className="mc-edit-card"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <i style={{ width: 40 }} className="material-icons">
                      mail
                    </i>
                    <span style={{ width: 100 }}>E-Mail</span>
                    <input
                      style={{
                        width: 420,
                        backgroundColor: "#FFF",
                        height: 30,
                        borderRadius: 8,
                        padding: 10,
                        border: "1px solid black",
                        color: "black",
                      }}
                      onChange={handleEmailChange}
                      value={realValue.email}
                    />
                    {isValidEmail !== null && (
                      <i
                        className="material-icons"
                        style={{
                          color: isValidEmail ? "green" : "red",
                          marginLeft: 10,
                        }}
                      >
                        {isValidEmail ? "check" : "close"}
                      </i>
                    )}
                  </li>
                  <div
                    styles={{ width: 400, height: 1, backgroundColor: "#FFF" }}
                  ></div>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      home
                    </i>
                    <span style={{ width: 100 }}>CEP</span>
                    <input
                      style={{
                        width: 290,
                        backgroundColor: "#FFF",
                        height: 30,
                        borderRadius: 8,
                        padding: 10,
                        border: "1px solid black",
                        color: "black",
                      }}
                      onChange={(e) => setHomeCep(e.target.value)}
                      value={homeCep}
                    />
                    <button
                      className="mc-btns"
                      onClick={handlehomeCepSearch}
                      style={{
                        width: 150,
                        height: 30,
                        padding: 6,
                        borderRadius: 8,
                        marginLeft: 10,
                      }}
                    >
                      {isLoading ? <span className="spinner" /> : "Buscar"}
                    </button>
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons"></i>
                    <span style={{ width: 100 }}>Rua</span>
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
                      onChange={(e) =>
                        setRealValue({ ...realValue, address: e.target.value })
                      }
                      value={isLoading ? "Carregando..." : realValue.address}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons"></i>
                    <span style={{ width: 100 }}>Numero</span>
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
                      onChange={(e) =>
                        setRealValue({ ...realValue, number: e.target.value })
                      }
                      value={realValue.number}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons"></i>
                    <span style={{ width: 100 }}>Complemento</span>
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
                      onChange={(e) =>
                        setRealValue({
                          ...realValue,
                          complement: e.target.value,
                        })
                      }
                      value={realValue.complement}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons"></i>
                    <span style={{ width: 100 }}>Bairro</span>
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
                      onChange={(e) =>
                        setRealValue({
                          ...realValue,
                          neighborhood: e.target.value,
                        })
                      }
                      value={
                        isLoading ? "Carregando..." : realValue.neighborhood
                      }
                    />
                  </li>
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
                      value={isLoading ? "Carregando..." : realValue.state}
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
                      value={isLoading ? "Carregando..." : realValue.city}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      summarize
                    </i>
                    <span style={{ width: 100 }}>Áreas</span>
                    <select
                      defaultValue={""}
                      onChange={(e) => {
                        const newArea = e.target.value;
                        if (
                          newArea &&
                          !realValue.services?.includes(newArea) &&
                          realValue.services.length < 4
                        ) {
                          setRealValue((prevValue) => ({
                            ...prevValue,
                            areas: [...prevValue.services, newArea],
                          }));
                        }
                      }}
                      style={{
                        width: 250,
                        height: 30,
                        backgroundColor: "#FFF",
                        borderRadius: 6,
                        color: "black",
                      }}
                    >
                      <option value="" disabled>
                        Selecione uma área
                      </option>
                      {areas?.map((area, index) => (
                        <option key={index} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                    {realValue.services?.map((area, index) => (
                      <div
                        key={index}
                        className="mc-product-view-meta"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: 4,
                          marginLeft: -3,
                        }}
                      >
                        {area && (
                          <>
                            <ul>
                              <li>
                                {area}
                                <button
                                  onClick={() => {
                                    setRealValue((prevValue) => ({
                                      ...prevValue,
                                      services: prevValue.services.filter(
                                        (_, i) => i !== index
                                      ),
                                    }));
                                  }}
                                  style={{
                                    marginLeft: 8,
                                    backgroundColor: "red",
                                    color: "white",
                                    borderRadius: 4,
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                >
                                  X
                                </button>
                              </li>
                            </ul>
                          </>
                        )}
                      </div>
                    ))}
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      pix
                    </i>
                    <span style={{ width: 100 }}>Chave Pix</span>
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
                      onChange={(e) =>
                        setRealValue({ ...realValue, pix: e.target.value })
                      }
                      value={realValue.pix}
                    />
                  </li>{" "}
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      group
                    </i>
                    <span style={{ width: 100 }}>Cod. Indicação</span>
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
                      onChange={(e) =>
                        setRealValue({
                          ...realValue,
                          identifyCode: e.target.value,
                        })
                      }
                      value={realValue.identifyCode}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      reorder
                    </i>
                    <span style={{ width: 100 }}>Status</span>
                    <select
                      style={{
                        width: 450,
                        backgroundColor: "#FFF",
                        height: 30,
                        borderRadius: 8,
                        border: "1px solid black",
                        color: "black",
                      }}
                      value={realValue.statusId}
                      onChange={handleStatusChange}
                    >
                      <option value="">Selecione um status</option>
                      {statuses?.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </li>
                </ul>
                <div
                  style={{
                    position: "absolute",
                    marginLeft: "25.8%",
                    marginTop: 30,
                  }}
                >
                  <AnchorComponent
                    className="mc-btns"
                    onClick={createUser}
                    type="button"
                    style={{ width: 100, height: 40, padding: 10 }}
                  >
                    Salvar
                  </AnchorComponent>
                </div>
              </div>
            )}
            {selectedTypeName.name === "Advogado" && (
              <div>
                <h6 className="mc-divide-title">Detalhes do profissional</h6>
                <h3 style={{ marginTop: 40, marginBottom: 39, marginLeft: 10 }}>
                  {realValue?.name}
                </h3>
                <ul>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      person
                    </i>
                    <span style={{ width: 100 }}>Nome</span>
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
                      onChange={(e) =>
                        setRealValue({ ...realValue, name: e.target.value })
                      }
                      value={realValue.name}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      phone
                    </i>
                    <span style={{ width: 100 }}>Telefone</span>
                    <input
                      maxLength={15}
                      style={{
                        width: 450,
                        backgroundColor: "#FFF",
                        height: 30,
                        borderRadius: 8,
                        padding: 10,
                        border: "1px solid black",
                        color: "black",
                      }}
                      onChange={(e) =>
                        setRealValue({
                          ...realValue,
                          phone: phoneMask(e.target.value),
                        })
                      }
                      value={realValue.phone}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      description
                    </i>
                    <span style={{ width: 100 }}>Documento</span>
                    <input
                      maxLength={18}
                      style={{
                        width: 450,
                        backgroundColor: "#FFF",
                        height: 30,
                        borderRadius: 8,
                        padding: 10,
                        border: "1px solid black",
                        color: "black",
                      }}
                      onChange={(e) =>
                        setRealValue({
                          ...realValue,
                          taxId: DocumentMask(e.target.value),
                        })
                      }
                      value={realValue.taxId}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      mail
                    </i>
                    <span style={{ width: 100 }}>E-Mail</span>
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
                      onChange={(e) =>
                        setRealValue({ ...realValue, email: e.target.value })
                      }
                      value={realValue.email}
                    />
                  </li>
                  <div
                    styles={{ width: 400, height: 1, backgroundColor: "#FFF" }}
                  ></div>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      home
                    </i>
                    <span style={{ width: 100 }}>CEP</span>
                    <input
                      style={{
                        width: 350,
                        backgroundColor: "#FFF",
                        height: 30,
                        borderRadius: 8,
                        padding: 10,
                        border: "1px solid black",
                        color: "black",
                      }}
                      onChange={(e) => setHomeCep(e.target.value)}
                      value={homeCep}
                    />
                    <button
                      className="mc-btns"
                      onClick={handlehomeCepSearch}
                      style={{ width: 100, height: 30, padding: 6 }}
                    >
                      {isLoading ? <span className="spinner" /> : "Buscar"}
                    </button>
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons"></i>
                    <span style={{ width: 100 }}>Rua</span>
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
                      onChange={(e) =>
                        setRealValue({ ...realValue, address: e.target.value })
                      }
                      value={isLoading ? "Carregando..." : realValue.address}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons"></i>
                    <span style={{ width: 100 }}>Numero</span>
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
                      onChange={(e) =>
                        setRealValue({ ...realValue, number: e.target.value })
                      }
                      value={realValue.number}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons"></i>
                    <span style={{ width: 100 }}>Complemento</span>
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
                      onChange={(e) =>
                        setRealValue({
                          ...realValue,
                          complement: e.target.value,
                        })
                      }
                      value={realValue.complement}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons"></i>
                    <span style={{ width: 100 }}>Bairro</span>
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
                      onChange={(e) =>
                        setRealValue({
                          ...realValue,
                          neighborhood: e.target.value,
                        })
                      }
                      value={
                        isLoading ? "Carregando..." : realValue.neighborhood
                      }
                    />
                  </li>
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
                      value={isLoading ? "Carregando..." : realValue.state}
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
                      value={isLoading ? "Carregando..." : realValue.city}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      summarize
                    </i>
                    <span style={{ width: 100 }}>Áreas</span>
                    <select
                      defaultValue={""}
                      onChange={(e) => {
                        const newArea = e.target.value;
                        if (
                          newArea &&
                          !realValue.services.includes(newArea) &&
                          realValue.services.length < 4
                        ) {
                          setRealValue((prevValue) => ({
                            ...prevValue,
                            services: [...prevValue.services, newArea],
                          }));
                        }
                      }}
                      style={{
                        width: 250,
                        height: 30,
                        backgroundColor: "#FFF",
                        borderRadius: 6,
                        color: "black",
                      }}
                    >
                      <option value="" disabled>
                        Selecione uma área
                      </option>
                      {areas?.map((area, index) => (
                        <option key={index} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                    {realValue?.services?.map((area, index) => (
                      <div
                        key={index}
                        className="mc-product-view-meta"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: 4,
                          marginLeft: -3,
                        }}
                      >
                        {area && (
                          <>
                            <ul>
                              <li>
                                {area}
                                <button
                                  onClick={() => {
                                    setRealValue((prevValue) => ({
                                      ...prevValue,
                                      services: prevValue.services.filter(
                                        (_, i) => i !== index
                                      ),
                                    }));
                                  }}
                                  style={{
                                    marginLeft: 8,
                                    backgroundColor: "red",
                                    color: "white",
                                    borderRadius: 4,
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                >
                                  X
                                </button>
                              </li>
                            </ul>
                          </>
                        )}
                      </div>
                    ))}
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      pix
                    </i>
                    <span style={{ width: 100 }}>Chave Pix</span>
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
                      onChange={(e) =>
                        setRealValue({ ...realValue, pix: e.target.value })
                      }
                      value={realValue.pix}
                    />
                  </li>{" "}
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      group
                    </i>
                    <span style={{ width: 100 }}>Cod. Indicação</span>
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
                      onChange={(e) =>
                        setRealValue({
                          ...realValue,
                          identifyCode: e.target.value,
                        })
                      }
                      value={realValue.identifyCode}
                    />
                  </li>
                  <li className="mc-edit-card">
                    <i style={{ width: 40 }} className="material-icons">
                      reorder
                    </i>
                    <span style={{ width: 100 }}>Status</span>
                    <select
                      style={{
                        width: 450,
                        backgroundColor: "#FFF",
                        height: 30,
                        borderRadius: 8,
                        border: "1px solid black",
                        color: "black",
                      }}
                      value={realValue.statusId}
                      onChange={handleStatusChange}
                    >
                      <option value="">Selecione um status</option>
                      {statuses?.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </li>
                </ul>
                <div
                  style={{
                    position: "absolute",
                    marginLeft: "25.8%",
                    marginTop: 30,
                  }}
                >
                  <AnchorComponent
                    className="mc-btns"
                    onClick={createUser}
                    type="button"
                    style={{ width: 100, height: 40, padding: 10 }}
                  >
                    Salvar
                  </AnchorComponent>
                </div>
              </div>
            )}
            {selectedTypeName.name !== "Cliente" &&
              selectedTypeName.name !== "Advogado" &&
              selectedTypeName.name !== "" && (
                <div>
                  <h6 className="mc-divide-title">Detalhes do profissional</h6>
                  <h3
                    style={{ marginTop: 40, marginBottom: 39, marginLeft: 10 }}
                  >
                    {realValue?.name}
                  </h3>
                  <ul>
                    <li className="mc-edit-card">
                      <i style={{ width: 40 }} className="material-icons">
                        description
                      </i>
                      <span style={{ width: 100 }}>Nome</span>
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
                        onChange={(e) =>
                          setRealValue({ ...realValue, name: e.target.value })
                        }
                        value={realValue.name}
                      />
                    </li>
                    <li className="mc-edit-card">
                      <i style={{ width: 40 }} className="material-icons">
                        phone
                      </i>
                      <span style={{ width: 100 }}>Telefone</span>
                      <input
                        maxLength={15}
                        style={{
                          width: 450,
                          backgroundColor: "#FFF",
                          height: 30,
                          borderRadius: 8,
                          padding: 10,
                          border: "1px solid black",
                          color: "black",
                        }}
                        onChange={(e) =>
                          setRealValue({
                            ...realValue,
                            phone: phoneMask(e.target.value),
                          })
                        }
                        value={realValue.phone}
                      />
                    </li>
                    <li className="mc-edit-card">
                      <i style={{ width: 40 }} className="material-icons">
                        description
                      </i>
                      <span style={{ width: 100 }}>Documento</span>
                      <input
                        maxLength={18}
                        style={{
                          width: 450,
                          backgroundColor: "#FFF",
                          height: 30,
                          borderRadius: 8,
                          padding: 10,
                          border: "1px solid black",
                          color: "black",
                        }}
                        onChange={(e) =>
                          setRealValue({
                            ...realValue,
                            taxId: DocumentMask(e.target.value),
                          })
                        }
                        value={realValue.taxId}
                      />
                    </li>
                    <li className="mc-edit-card">
                      <i style={{ width: 40 }} className="material-icons">
                        mail
                      </i>
                      <span style={{ width: 100 }}>E-Mail</span>
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
                        onChange={(e) =>
                          setRealValue({ ...realValue, email: e.target.value })
                        }
                        value={realValue.email}
                      />
                    </li>
                    <li className="mc-edit-card">
                      <i style={{ width: 40 }} className="material-icons">
                        home
                      </i>
                      <span style={{ width: 100 }}>CEP</span>
                      <input
                        style={{
                          width: 350,
                          backgroundColor: "#FFF",
                          height: 30,
                          borderRadius: 8,
                          padding: 10,
                          border: "1px solid black",
                          color: "black",
                        }}
                        onChange={(e) => setHomeCep(e.target.value)}
                        value={homeCep}
                      />
                      <button
                        className="mc-btns"
                        onClick={handlehomeCepSearch}
                        style={{ width: 100, height: 30, padding: 6 }}
                      >
                        {isLoading ? <span className="spinner" /> : "Buscar"}
                      </button>
                    </li>
                    <li className="mc-edit-card">
                      <i style={{ width: 40 }} className="material-icons"></i>
                      <span style={{ width: 100 }}>Rua</span>
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
                        onChange={(e) =>
                          setRealValue({
                            ...realValue,
                            address: e.target.value,
                          })
                        }
                        value={isLoading ? "Carregando..." : realValue.address}
                      />
                    </li>
                    <li className="mc-edit-card">
                      <i style={{ width: 40 }} className="material-icons"></i>
                      <span style={{ width: 100 }}>Numero</span>
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
                        onChange={(e) =>
                          setRealValue({ ...realValue, number: e.target.value })
                        }
                        value={realValue.number}
                      />
                    </li>
                    <li className="mc-edit-card">
                      <i style={{ width: 40 }} className="material-icons"></i>
                      <span style={{ width: 100 }}>Complemento</span>
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
                        onChange={(e) =>
                          setRealValue({
                            ...realValue,
                            complement: e.target.value,
                          })
                        }
                        value={realValue.complement}
                      />
                    </li>
                    <li className="mc-edit-card">
                      <i style={{ width: 40 }} className="material-icons"></i>
                      <span style={{ width: 100 }}>Bairro</span>
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
                        onChange={(e) =>
                          setRealValue({
                            ...realValue,
                            neighborhood: e.target.value,
                          })
                        }
                        value={
                          isLoading ? "Carregando..." : realValue.neighborhood
                        }
                      />
                    </li>
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
                        value={isLoading ? "Carregando..." : realValue.state}
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
                        value={isLoading ? "Carregando..." : realValue.city}
                      />
                    </li>
                    <li className="mc-edit-card">
                      <i style={{ width: 40 }} className="material-icons">
                        pix
                      </i>
                      <span style={{ width: 100 }}>Chave Pix</span>
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
                        onChange={(e) =>
                          setRealValue({ ...realValue, pix: e.target.value })
                        }
                        value={realValue.pix}
                      />
                    </li>
                    <li className="mc-edit-card">
                      <i style={{ width: 40 }} className="material-icons">
                        reorder
                      </i>
                      <span style={{ width: 100 }}>Status</span>
                      <select
                        style={{
                          width: 450,
                          backgroundColor: "#FFF",
                          height: 30,
                          borderRadius: 8,
                          border: "1px solid black",
                          color: "black",
                        }}
                        value={realValue.statusId}
                        onChange={handleStatusChange}
                      >
                        <option value="">Selecione um status</option>
                        {statuses?.map((status) => (
                          <option key={status.id} value={status.id}>
                            {status.name}
                          </option>
                        ))}
                      </select>
                    </li>
                  </ul>
                  <div
                    style={{
                      position: "absolute",
                      marginLeft: "25.8%",
                      marginTop: 30,
                    }}
                  >
                    <AnchorComponent
                      className="mc-btns"
                      onClick={createUser}
                      type="button"
                      style={{ width: 100, height: 40, padding: 10 }}
                    >
                      Salvar
                    </AnchorComponent>
                  </div>
                </div>
              )}
          </Col>

          {selectedTypeName.name === "Advogado" && (
            <Col xl={12}>
              <h6 className="mc-divide-title mt-5 mb-4">Documentos Enviados</h6>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                {realValue.documents?.map((doc, index) => (
                  <div key={index} style={{ marginBottom: 20 }}>
                    <img
                      style={{ maxWidth: 300, maxHeight: 300 }}
                      src={doc}
                      alt={`document-${index}`}
                    />
                  </div>
                ))}
              </div>
              <label
                htmlFor="file-upload"
                style={{
                  width: 100,
                  height: 50,
                  display: "inline-block",
                  fontSize: "16px",
                  cursor: "pointer",
                  backgroundColor: "blue",
                  color: "white",
                  borderRadius: "8px",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                + Adicionar Documento
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                achomeCept="image/*"
                style={{ display: "none" }}
                onChange={handleDocumentsChange}
              />
            </Col>
          )}
        </Row>
      </div>
    </PageLayout>
  );
}
