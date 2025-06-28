import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../config";
import { SidebarContext } from "../context/Sidebar";

export default function SidebarLayout() {
  const [indicationCount, setIndicationCount] = useState(0);
  const [paymentsCount, setPaymentsCount] = useState(0);

  const fetchData = async () => {
    try {
      const [indicationsRes, summaryRes] = await Promise.all([
        axios.get(`${BASE_URL}/payment/by-indication`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get(`${BASE_URL}/payment/pending-summary`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      setIndicationCount(indicationsRes.data.length || 0);
      setPaymentsCount(summaryRes.data.length || 0);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { sidebar } = useContext(SidebarContext);

  return (
    <aside
      as="aside"
      className={`mc-sidebar thin-scrolling ${sidebar && "active"}`}
    >
      <menu className="mc-sidebar-menu">
        <h5 className="mc-sidebar-menu-title">Páginas</h5>
        <ul className="mc-sidebar-menu-list">
          <li className="mc-sidebar-menu-item">
            <Link to={"/home"} className="mc-sidebar-menu-btn">
              <div>
                <i className="material-icons">home</i>
              </div>
              <span>Inicio</span>
            </Link>
          </li>
          <li className="mc-sidebar-menu-item">
            <Link to={"/create"} className="mc-sidebar-menu-btn">
              <div>
                <i className="material-icons">person_add</i>
              </div>
              <span>Criação</span>
            </Link>
          </li>
          <li className="mc-sidebar-menu-item">
            <Link to={"/user-list"} className="mc-sidebar-menu-btn">
              <div>
                <i className="material-icons">person</i>
              </div>
              <span>Usuários</span>
            </Link>
          </li>
          <li className="mc-sidebar-menu-item">
            <Link to={"/professional-list"} className="mc-sidebar-menu-btn">
              <div>
                <i className="material-icons">contact_mail</i>
              </div>
              <span>Profissionais</span>
            </Link>
          </li>
          <li className="mc-sidebar-menu-item">
            <Link to={"/requestClient"} className="mc-sidebar-menu-btn">
              <div>
                <i className="material-icons">person</i>
                <i className="material-icons">paid</i>
              </div>
              <span>Solicitacões de Indicações</span>
              <sup className={"primary round"}>{indicationCount}</sup>
            </Link>
          </li>
          <li className="mc-sidebar-menu-item">
            <Link to={"/requestProfessional"} className="mc-sidebar-menu-btn">
              <div>
                <i className="material-icons">contact_mail</i>
                <i className="material-icons">paid</i>
              </div>
              <span>Solicitacões de Profissionais</span>
              <sup className={"primary round"}>{paymentsCount}</sup>
            </Link>
          </li>
          <li className="mc-sidebar-menu-item">
            <Link to={"/indications"} className="mc-sidebar-menu-btn">
              <div>
                <i className="material-icons">groups</i>
              </div>
              <span>Indicações</span>
            </Link>
          </li>
        </ul>
      </menu>

      <div className="mc-sidebar-logout text-center">
        <Link to="/" className="mc-btn primary sm">
          <i className="material-icons">lock</i>
          <span>logout</span>
        </Link>
      </div>
    </aside>
  );
}
