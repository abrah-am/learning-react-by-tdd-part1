import React, { useState } from "react";

export const CustomerForm = ({ original, onSave }) => { 

    const [error, setError] = useState(false);

    const [ customer, setCustomer ] = useState(original); 

    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = ({ target }) => setCustomer((customer) => ({
        ...customer,
        [target.name]: target.value
    }));

    const renderError = (fieldName) => (
        <span id="firstNameError" role="alert">
            { hasError(fieldName) ? validationErrors[fieldName] : '' }
        </span>
    );

    const required = description => value => !value || value.trim() === '' ? description : undefined;

    const Error = ({ hasError }) => (
        <p role="alert">
            { hasError ? 'An error occurred during save' : '' }
        </p>
    );

    const hasError = (fieldName) => validationErrors[fieldName] !== undefined;

    const handleBlur = ({ target }) => {
        const validators = {
            firstName: required('First name is required')
        };
        const result = validators[target.name](target.value);
        setValidationErrors({
            ...validationErrors,
            [target.name]: result
        })
    };

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
        if (result.ok) {
            setError(false);
            const customerWithId = await result.json();
            onSave(customerWithId);
        }
        else {
            setError(true);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Error hasError={error} />
            <label htmlFor="firstName">First name</label>
            <input 
                id="firstName" 
                type="text" 
                name="firstName" 
                value={customer.firstName} 
                onChange={handleChange} 
                onBlur={handleBlur}
                aria-describedby="firstNameError"
            />
            { renderError('firstName') }

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