import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import BASE_URL from "../../config";
import {
  activeStatusId,
  blockedStatusId,
  inactiveStatusId,
  pendingStatusId,
} from "../../utils";
import { AnchorComponent, ButtonComponent } from "../elements";

export default function ProfessionalTableComponent({ thead, tbody, total }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchUf, setSearchUf] = useState("");
  const [validUserTypeIds, setValidUserTypeIds] = useState({
    adv: "",
    dev: "",
    inf: "",
    adm: "",
  });
  const [effectiveSearch, setEffectiveSearch] = useState({
    query: "",
    statusId: "",
    state: "",
  });

  const [professionalData, setProfessionalData] = useState();
  const [professionalstatus, setProfessionalStatus] = useState("ativo");

  const handleChangeStatus = async () => {
    try {
      await axios.patch(
        `https://api.obeca.com.br/user/update-status/user/${professionalData.id}/status/${professionalstatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProfessionalStatus("ativo");
      setEditModal(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil do usuário:", error);
    }
  };

  const fetchUserTypes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/usertypes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const userTypes = response.data;
      const validTypes = userTypes.reduce((acc, type) => {
        switch (type.name) {
          case "Advogado":
            acc.adv = type.id;
            break;
          case "Administrador":
            acc.adm = type.id;
            break;
          case "Influenciador":
            acc.inf = type.id;
            break;
          case "Cliente":
            acc.inf = type.id;
            break;
          default:
            break;
        }
        return acc;
      }, {});
      setValidUserTypeIds(validTypes);
    } catch (error) {
      console.error("Error fetching user types:", error);
    }
  };
  useEffect(() => {
    fetchUserTypes();
  }, []);

  useEffect(() => {
    const professionals = tbody.filter((item) =>
      [
        validUserTypeIds.adv,
        validUserTypeIds.dev,
        validUserTypeIds.inf,
      ].includes(item.userTypeId)
    );
    setData(professionals);
  }, [tbody, validUserTypeIds]);

  useEffect(() => {
    const { query, statusId, state } = effectiveSearch;
    const lowercasedQuery = query.toLowerCase();
    const lowercasedStatus = statusId.toLowerCase();
    const lowercasedUf = state.toLowerCase();
    const filtered = data.filter(
      (item) =>
        (item.name.toLowerCase().includes(lowercasedQuery) ||
          item.identifyCode.toLowerCase().includes(lowercasedQuery)) &&
        item.statusId.toLowerCase().includes(lowercasedStatus) &&
        item.state.toLowerCase().includes(lowercasedUf)
    );
    setFilteredData(filtered);
  }, [effectiveSearch, data]);

  const itemsPerPage = 10;
  let currentData;
  if (total === 5) {
    currentData = [...filteredData].reverse().slice(0, 5);
  } else {
    currentData = [...filteredData];
    currentData.sort((a, b) => (a.name > b.name ? 1 : -1));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    currentData = currentData.slice(indexOfFirstItem, indexOfLastItem);
  }

  const totalPages =
    total === 5 ? 1 : Math.ceil(filteredData.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="mc-table-responsive">
      {total > 5 && (
        <div className="mc-inputs" style={{ display: "flex", gap: "10px" }}>
          <input
            className="mc-message-chat-footer2"
            type="text"
            placeholder="Buscar por nome ou documento"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              marginBottom: "20px",
              padding: "10px",
              width: "20%",
              border: "1px solid black",
            }}
          />
          <input
            className="mc-message-chat-footer2"
            type="text"
            placeholder="Buscar por status"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            style={{
              marginBottom: "20px",
              padding: "10px",
              width: "10%",
              border: "1px solid black",
            }}
          />
          <select
            className="mc-message-chat-footer2"
            value={searchUf}
            onChange={(e) => setSearchUf(e.target.value)}
            style={{
              marginBottom: "20px",
              padding: "10px",
              width: "10%",
              border: "1px solid black",
            }}
          >
            <option value="">UF</option>
            <option value="">Selecione UF</option>
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
            <option value="DF">Distrito Federal</option>
          </select>
          <button
            onClick={() => {
              setEffectiveSearch({
                query: searchQuery,
                statusId: searchStatus,
                state: searchUf,
              });
            }}
            className="btn2"
            style={{
              width: 100,
              height: 30,
              marginTop: 8,
              padding: "10px",
              border: "1px solid black",
            }}
          >
            Buscar
          </button>
          <button
            onClick={() => {
              setSearchQuery("");
              setSearchStatus("");
              setSearchUf("");
              setEffectiveSearch({ query: "", statusId: "", state: "" });
            }}
            className="btn2"
            style={{
              width: 100,
              height: 30,
              marginTop: 8,
              padding: "10px",
              border: "1px solid black",
            }}
          >
            Limpar
          </button>
        </div>
      )}
      <table className="mc-table">
        <thead className="mc-table-head primary">
          <tr>
            {thead.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody className="mc-table-body even">
          {currentData.map((item, index) => (
            <tr key={item.id || index}>
              <td title={item.name}>
                <div className="mc-table-profile">
                  <img src={item.src} alt={item.alt} />
                  <p>{item.name}</p>
                </div>
              </td>
              <td title={item.function}>
                <div className="mc-table-icon role">
                  {item.userTypeId === validUserTypeIds.adv && (
                    <i className="material-icons blue">person</i>
                  )}
                  {item.userTypeId === validUserTypeIds.dev && (
                    <i className="material-icons purple">tv_signin</i>
                  )}
                  {item.userTypeId === validUserTypeIds.inf && (
                    <i className="material-icons yellow">
                      settings_accessibility
                    </i>
                  )}
                  <span>
                    {item.userTypeId === validUserTypeIds.adv && "Advogado"}
                    {item.userTypeId === validUserTypeIds.adm &&
                      "Administrador"}
                    {item.userTypeId === validUserTypeIds.dev &&
                      "Desenvolvedor"}
                    {item.userTypeId === validUserTypeIds.inf &&
                      "Influenciador"}
                  </span>
                </div>
              </td>
              <td title={item.taxId}>
                {item.taxId ? item.taxId : "Documento indisponivel"}
              </td>
              <td title={item.email}>{item.email}</td>
              <td title={item.clients}>{item.clients}</td>
              <td title={item.state}>{item.state}</td>
              <td title={item.phone}>{item.phone}</td>
              <td title={item.statusId}>
                {item.statusId === activeStatusId && (
                  <p className="mc-table-badge green">Ativo</p>
                )}
                {item.statusId === inactiveStatusId && (
                  <p className="mc-table-badge red">Inativo</p>
                )}
                {item.statusId === blockedStatusId && (
                  <p className="mc-table-badge red">Bloqueado</p>
                )}
                {item.statusId === pendingStatusId && (
                  <p className="mc-table-badge purple">Pendente</p>
                )}
              </td>
              <td title={item.created_at}>
                {new Intl.DateTimeFormat("pt-BR").format(
                  new Date(item.created_at)
                )}
              </td>
              <td>
                <div className="mc-table-action">
                  <AnchorComponent
                    to={`/professional-view/${item.id}`}
                    title="View"
                    className="material-icons view"
                  >
                    visibility
                  </AnchorComponent>
                  <AnchorComponent
                    to={`/professional-edit/${item.id}`}
                    title="Edit"
                    className="material-icons edit"
                  >
                    edit
                  </AnchorComponent>
                  <ButtonComponent
                    title="Block"
                    className="material-icons block"
                    onClick={() => {
                      setProfessionalData(item);
                      setEditModal(true);
                    }}
                  >
                    block
                  </ButtonComponent>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <div className="mc-user-modal">
          <img src={professionalData?.src} alt={professionalData?.alt} />
          <h4>{professionalData?.name}</h4>
          <p>{professionalData?.email}</p>
          <Form.Group className="form-group inline">
            <Form.Label>Status</Form.Label>
            <Form.Select
              onChange={(e) => {
                setProfessionalStatus(e.target.value);
              }}
            >
              <option disabled>Selecione um status</option>
              <option value={"ativo"}>Ativo</option>
              <option value={"pendente"}>Pendente</option>
              <option value={"inativo"}>Inativo</option>
              <option value={"bloqueado"}>Bloqueado</option>
            </Form.Select>
          </Form.Group>
          <Modal.Footer>
            <ButtonComponent
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditModal(false)}
            >
              Fechar
            </ButtonComponent>
            <ButtonComponent
              type="button"
              className="btn btn-success"
              onClick={handleChangeStatus}
            >
              Salvar
            </ButtonComponent>
          </Modal.Footer>
        </div>
      </Modal>

      {total > itemsPerPage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            padding: "10px",
            gap: 10,
          }}
        >
          <button
            style={{
              fontWeight: "bold",
              fontSize: "20px",
              width: 40,
              height: 30,
              borderRadius: 10,
              color: "#0059ff8a",
            }}
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            &#60;
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor:
                  currentPage === index + 1 ? "#0059ff8a" : "#fff",
                color: currentPage === index + 1 ? "#fff" : "#0059ff8a",
                border:
                  currentPage === index + 1 ? "none" : "1px solid #0059ff8a",
                cursor: "pointer",
              }}
              onClick={() => goToPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            style={{
              fontWeight: "bold",
              fontSize: "20px",
              width: 40,
              height: 30,
              borderRadius: 10,
              color: "#0059ff8a",
            }}
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            &#62;
          </button>
        </div>
      )}
    </div>
  );
}
