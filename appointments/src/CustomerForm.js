import React, { useState } from "react";

export const CustomerForm = ({ original, onSubmit }) => { 

    const [ customer, setCustomer ] = useState(original); 

    const handleChangeFirstName = ({ target }) => setCustomer((customer) => ({
        ...customer,
        firstName: target.value
    }));

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(customer);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="firstName">First name</label>
            <input 
                id="firstName" 
                type="text" 
                name="firstName" 
                value={customer.firstName} 
                onChange={handleChangeFirstName} 
            />

            <input 
                type="submit" 
                value="Add" 
            />
        </form>
    )
};