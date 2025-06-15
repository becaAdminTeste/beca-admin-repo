import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import Modal from 'react-bootstrap/Modal';
import { AnchorComponent, ButtonComponent } from "../elements";

export default function ProductsTableComponent({ thead, tbody }) {

    const { t } = useContext(TranslatorContext)

    const [alertModal, setAlertModal] = useState(false);
    const [data, setData] = useState([]);

    useEffect(()=> { setData(tbody) }, [tbody]);

    const handleCheckbox = (event) => {
        const { name, checked } = event.target;

        if(name === "allCheck") {
            const checkData = data?.map((item)=> {
                return { ...item, isChecked: checked };
            });
            setData(checkData);
        }
        else {
            const checkData = data?.map((item) => 
                item.name === name ? {...item, isChecked: checked} : item
            );
            setData(checkData);
        }
    }

    return (
        <div className="mc-table-responsive">
            <table className="mc-table product">
                <thead className="mc-table-head primary">
                    <tr>
                        <th>
                            <div className="mc-table-check">
                                <input 
                                    type="checkbox" 
                                    name="allCheck"
                                    checked={ data?.filter((item)=> item.isChecked !== true).length < 1 } 
                                    onChange={ handleCheckbox } 
                                />
                                <p>uid</p>
                            </div>
                        </th>
                        {thead.map((item, index) => (
                            <th key={ index }>{ t(item) }</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="mc-table-body even">
                    {data?.map((item, index) => (
                        <tr key={ index }> 
                            <td title={ index + 1 }>
                                <div className="mc-table-check">
                                    <input 
                                        type="checkbox" 
                                        name={'check' + index} 
                                        checked={ item?.isChecked || false }
                                        onChange={ handleCheckbox } 
                                    />
                                    <p>#{ index + 1 }</p>
                                </div>
                            </td>
                            <td>
                                <div className="mc-table-product md">
                                    <img src={ item.image } alt='product' />
                                    <div className="mc-table-group">
                                        <h6>{ item.heading }</h6>
                                        <p>{ item.describe }</p>
                                    </div>
                                </div>
                            </td>
                            <td>{ item.category }</td>
                            <td>{ item.brand }</td>
                            <td>
                                <div className="mc-table-price">
                                    <del>{ item.price.previous }</del>
                                    <p>{ item.price.present }</p>
                                </div>
                            </td>
                            <td>{ item.stock }</td>
                            <td>
                                <div className="mc-table-rating">
                                    <i className="material-icons">star</i>
                                    <h3>{ item.rating.percent }</h3>
                                    <p>({ item.rating.number })</p>
                                </div>
                            </td>
                            <td>{ item.order }</td>
                            <td>{ item.sales }</td>
                            <td>
                                <div className="mc-table-action">
                                    <AnchorComponent to="/professional-view" title="View" className="material-icons view">{ item.action.view }</AnchorComponent>
                                    <AnchorComponent to="/product-upload" title="Edit" className="material-icons edit">{ item.action.edit }</AnchorComponent>
                                    <ButtonComponent type="button" title="Delete" className="material-icons delete" onClick={()=> setAlertModal(true)}>{ item.action.delete }</ButtonComponent>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={ alertModal } onHide={()=> setAlertModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons">new_releases</i>
                    <h3>are your sure!</h3>
                    <p>Want to delete this product?</p>
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={()=> setAlertModal(false)}>{t('close')}</ButtonComponent>
                        <ButtonComponent type="button" className="btn btn-danger" onClick={()=> setAlertModal(false)}>{t('delete')}</ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
}