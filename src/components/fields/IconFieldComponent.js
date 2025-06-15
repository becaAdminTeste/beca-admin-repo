import React from "react";
import { ButtonComponent } from "../elements";

export default function IconFieldComponent({ classes, icon, option, activeOption, type, placeholder, passwordVisible, ...rest }) {
    const [visible, setVisible] = React.useState(false);
    
    return (
        <div style={{display: 'flex', width: 285, height: 40, gap: 10, borderRadius: 8, border: '1px solid #FFF', alignItems: 'center', padding: '10px'}}>
            <i className="material-icons">{icon || 'account_circle'}</i>
                    <input
                    className="input-style-login"
                        type={ visible ? "text" : type || "text" }  
                        placeholder={ type ? placeholder || "Type here..." : "" } 
{...rest}
                    />
                    {passwordVisible && 
                        <ButtonComponent
                            type = "button"
                            className = "material-icons"
                            onClick = {()=> setVisible(!visible)}
                        >
                            { visible ? "visibility_off" : "visibility" }
                        </ButtonComponent>
                    }
       </div>
    )
}