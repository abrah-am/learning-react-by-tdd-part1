import React, { useState } from "react";

export const CustomerForm = ({ original }) => { 

    const [ customer, setCustomer ] = useState(original); 

    const handleChange = ({ target }) => setCustomer((customer) => ({
        ...customer,
        [target.name]: target.value
    }));

    const handleSubmit = (event) => {
        event.preventDefault();
        global.fetch('/customers', { 
            method: "POST",
            credentials: 'same-origin',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="firstName">First name</label>
            <input 
                id="firstName" 
                type="text" 
                name="firstName" 
                value={customer.firstName} 
                onChange={handleChange} 
            />

            <label htmlFor="lastName">Last name</label>
            <input 
                id="lastName" 
                type="text"
                name="lastName"
                value={customer.lastName}
                onChange={handleChange}
            />

            <label htmlFor="phoneNumber">Phone number</label>
            <input
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                value={customer.phoneNumber}
                onChange={handleChange}
            />

            <input 
                type="submit" 
                value="Add" 
            />
        </form>
    )
};