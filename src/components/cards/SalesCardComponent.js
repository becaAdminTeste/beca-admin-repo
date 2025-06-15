import React from "react";
import { SalesChartComponent } from "../charts";

export default function SalesCardComponent() {
  const atualValue = 0;
  const lastMonthValue = 0;
  const percentual = 0

  return (
    <div className="mc-sales-card">
      <div className="mc-sales-card-group">
        <div className="mc-card-header">
          <h4 className="mc-card-title">Valor total</h4>
        </div>
        <div className="mc-sales-card-amount trending_up green">
          <h3>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
            }).format(atualValue)}
          </h3>
          <p>
            {new Intl.NumberFormat("en-US", {
              style: "percent",
              minimumFractionDigits: 1,
              maximumFractionDigits: 2,
            }).format(percentual / 100)}
            <div hidden={atualValue === 0 && lastMonthValue === 0}>
              {atualValue > lastMonthValue ? (
                <i className="material-icons">trending_up</i>
              ) : (
                <i className="material-icons">trending_down</i>
              )}
            </div>
          </p>
        </div>
        <p className="mc-sales-card-compare">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
          }).format(lastMonthValue)}
        </p>
      </div>
      <SalesChartComponent />
    </div>
  );
}
