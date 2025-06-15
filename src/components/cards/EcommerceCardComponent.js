import React from "react"

export default function EcommerceCardComponent({ variant, trend, number, title, icon, percent }) {

    return (
        <div className={`mc-ecommerce-card ${ variant }`}>
            <i className="mc-ecommerce-card-trend material-icons">{ trend }</i>
            <div className="mc-ecommerce-card-head">
                <h4 className="mc-ecommerce-card-meta">
                    <span>{ title }</span>
                    { number }
                </h4>
                <i className="mc-ecommerce-card-icon material-icons">{ icon }</i>
            </div>
            <div className="mc-ecommerce-card-foot">
                <div className="mc-ecommerce-card-compare">
                    <mark>+ { percent }%</mark>
                    <span>{'Ultimo mês'}</span>
                </div>
            </div>
        </div>
    );
}