// ValidationContext.js
import React, { createContext, useContext } from 'react';

const ValidationContext = createContext();

export const useValidation = () => useContext(ValidationContext);

export const ValidationProvider = ({ children }) => {
    const isValidId = (id) => {
        return !isNaN(id) && Number.isInteger(Number(id));
    };

    const isValidCatId = (catid) => {
        return !isNaN(catid) && Number.isInteger(Number(catid));
    };

    return (
        <ValidationContext.Provider value={{ isValidId, isValidCatId }}>
            {children}
        </ValidationContext.Provider>
    );
};
