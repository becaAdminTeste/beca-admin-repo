import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import { SidebarContext } from "../context/Sidebar";
import specifics from "../assets/data/specifics.json";


export default function SidebarLayout() {
    const [requests] = useState(specifics.filter(user => user.type === "Usuário" && user.withdrawalDate));

    const [payments] = useState(specifics.filter(item => item.type === "Professional").map((item, index) => ({ ...item, id: index })));
    const { sidebar } = useContext(SidebarContext);


    return (
        <aside as="aside" className={`mc-sidebar thin-scrolling ${ sidebar && "active"}`}>
                <menu className="mc-sidebar-menu">
                    <h5 className="mc-sidebar-menu-title">Páginas</h5>
                    <ul className="mc-sidebar-menu-list">
                            <li className='mc-sidebar-menu-item'>
                                <Link to={'/home'} className="mc-sidebar-menu-btn">
                                    <div>
                                        <i className="material-icons">home</i>
                                    </div>
                                    <span>Inicio</span>
                                </Link>
                            </li>
                            <li className='mc-sidebar-menu-item'>
                                <Link to={'/create'} className="mc-sidebar-menu-btn">
                                    <div>
                                        <i className="material-icons">person_add</i>
                                    </div>
                                    <span>Criação</span>
                                </Link>
                            </li>
                            <li className='mc-sidebar-menu-item'>
                                <Link to={'/user-list'} className="mc-sidebar-menu-btn">
                                    <div>
                                        <i className="material-icons">person</i>
                                    </div>
                                    <span>Usuários</span>
                                </Link>
                            </li>
                            <li className='mc-sidebar-menu-item'>
                                <Link to={'/professional-list'} className="mc-sidebar-menu-btn">
                                    <div>
                                        <i className="material-icons">contact_mail</i>
                                    </div>
                                    <span>Profissionais</span>
                                </Link>
                            </li>
                            <li className='mc-sidebar-menu-item'>
                                <Link to={'/requestClient'} className="mc-sidebar-menu-btn">
                                    <div>
                                    <i className="material-icons">person</i>
                                    <i className="material-icons">paid</i>
                                    </div>
                                    <span>Solicitacões de Usuários</span>
                                    <sup className={"primary round"}>{requests.length}</sup>
                                </Link>
                            </li>
                            <li className='mc-sidebar-menu-item'>
                                <Link to={'/requestProfessional'} className="mc-sidebar-menu-btn">
                                    <div>
                                    <i className="material-icons">contact_mail</i>
                                    <i className="material-icons">paid</i>
                                    </div>
                                    <span>Solicitacões de Profissionais</span>
                                    <sup className={"primary round"}>{payments.length}</sup>
                                </Link>
                            </li>
                            <li className='mc-sidebar-menu-item'>
                                <Link to={'/indications'} className="mc-sidebar-menu-btn">
                                    <div>
                                        <i className="material-icons">groups</i>
                                    </div>
                                    <span>Indicações</span>
                                </Link>
                            </li>
                    </ul>

                </menu>

            <div className="mc-sidebar-logout text-center">
                <Link to='/' className="mc-btn primary sm">
                    <i className="material-icons">lock</i>
                    <span>logout</span>
                </Link>
            </div>
        </aside>
    )
}

