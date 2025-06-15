import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Tab, Tabs } from "react-bootstrap";
import { LegendFieldComponent } from "../../components/fields";
import { ButtonComponent } from "../../components/elements";
import { FileUploadComponent } from "../../components";
import PageLayout from "../../layouts/PageLayout";
import { useAppContext } from "../../context/AppProvider";

export default function MyAccountPage() {
  const { dashboardUser, userImage, dashboardUserType } =
    useAppContext();

  return (
    <PageLayout>
      <Row>
        <Col xl={12}>
          <div className="mc-card">
            <div className="mc-breadcrumb">
              <h3 className="mc-breadcrumb-title">Minha Conta</h3>
              <ul className="mc-breadcrumb-list">
                <li className="mc-breadcrumb-item">
                  <Link to="#" className="mc-breadcrumb-link">
                    Home
                  </Link>
                </li>
                <li className="mc-breadcrumb-item">Minha Conta</li>
              </ul>
            </div>
          </div>
        </Col>
        <Col xl={12}>
          <div className="mc-card">
            <Tabs defaultActiveKey="profile" id="mc" className="mc-tabs">
              <Tab eventKey="profile" className="mc-tabpane profile">
                <div className="mc-tab-card">
                  <Row>
                    <Col xl={4}>
                      <div className="mc-user-avatar-upload" style={{display: 'flex', flexDirection: 'column',  gap: 20}}>
                        <div>
                          <img src={userImage} alt="" style={{maxHeight: 400, maxWidth: 400, width: 400, height: 400, border: '3px solid blue', borderRadius: '100%'}} />
                        </div>
                        <FileUploadComponent
                          icon="cloud_upload"
                          text={"upload"}
                        />
                      </div>
                    </Col>
                    <Col xl={8}>
                      <Row>
                        <Col xl={6}>
                          <LegendFieldComponent
                            type="text"
                            title={"Nome Completo"}
                            value={dashboardUser.name}
                            className="mb-4"
                          />
                        </Col>
                        <Col xl={6}>
                          <LegendFieldComponent
                            type="text"
                            title={"Tipo"}
                            value={dashboardUserType}
                            className="mb-4"
                          />
                        </Col>
                        <Col xl={6}>
                          <LegendFieldComponent
                            type="text"
                            title={"Email"}
                            value={dashboardUser.email}
                            className="mb-4"
                          />
                        </Col>
                        <Col xl={6}>
                          <LegendFieldComponent
                            type="text"
                            title={"Telefone"}
                            value={dashboardUser.phone}
                            className="mb-4"
                          />
                        </Col>
                        <Col xl={6}>
                          <LegendFieldComponent
                            type="text"
                            title={"Documento"}
                            value={dashboardUser.taxId}
                            className="mb-4"
                          />
                        </Col>
                        <Col xl={6}>
                          <LegendFieldComponent
                            type="text"
                            title={"Chave PIX"}
                            value={dashboardUser.pix}
                            className="mb-4"
                          />
                        </Col>
                        <Col xl={6}>
                          <LegendFieldComponent
                            type="text"
                            title={"CEP"}
                            value={dashboardUser.zipCode}
                            className="mb-4"
                          />
                        </Col>
                        <Col xl={6}>
                          <LegendFieldComponent
                            type="text"
                            title={"Endereço"}
                            value={dashboardUser.address}
                            className="mb-4"
                          />
                        </Col>
                        <Col xl={6}>
                          <LegendFieldComponent
                            type="text"
                            title={"Numero"}
                            value={dashboardUser.number}
                            className="mb-4"
                          />
                        </Col>
                        <Col xl={6}>
                          <LegendFieldComponent
                            type="text"
                            title={"Complemento"}
                            value={dashboardUser.complement}
                            className="mb-4"
                          />
                        </Col>
                        <Col xl={6}>
                          <LegendFieldComponent
                            type="text"
                            title={"Bairro"}
                            value={dashboardUser.neighborhood}
                            className="mb-4"
                          />
                        </Col>
                        <Col xl={6}>
                          <LegendFieldComponent
                            type="text"
                            title={"Cidade"}
                            value={dashboardUser.city}
                            className="mb-4"
                          />
                        </Col>
                        <Col xl={6}>
                          <LegendFieldComponent
                            type="text"
                            title={"Estado"}
                            value={dashboardUser.state}
                            className="mb-4"
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
                <ButtonComponent
                  className="mc-btn primary"
                  icon="verified"
                  text={"Salvar"}
                />
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
    </PageLayout>
  );
}
