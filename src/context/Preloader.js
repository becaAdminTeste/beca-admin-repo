import { createContext, useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        setLoading(true);
        setTimeout(()=> { setLoading(false) }, 1000);
    }, []);

    return (
        <LoaderContext.Provider value={{ loading }}>
            { loading ? 
                <div className="mc-spinner">
                    <img className="pattern" src="images/BecaLogo2.png" alt="pattern" />
                    <img className="favicon" src="images/BecaLogo2.png" alt="logo" />
                    <div className="mc-spinner-group">
                        <h3 style={{color: 'white'}}>Loading</h3>
                        <PulseLoader 
                            color="#4e4e4e"
                            loading={loading} 
                            size={8} 
                        /> 
                    </div>
                </div>
                : 
                children 
            }
        </LoaderContext.Provider>
    )
}