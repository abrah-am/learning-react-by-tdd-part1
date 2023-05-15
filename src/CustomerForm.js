import React, { useState } from "react";

export const CustomerForm = ({ original, onSave }) => { 

    const [ customer, setCustomer ] = useState(original); 

    const handleChange = ({ target }) => setCustomer((customer) => ({
        ...customer,
        [target.name]: target.value
    }));

    const handleSubmit = async (event) => {
        event.preventDefault();
        const result = await global.fetch('/customers', { 
            method: "POST",
            credentials: 'same-origin',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer),
        });
        const customerWithId = await result.json();
        onSave(customerWithId)
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