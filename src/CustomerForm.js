import React, { useState } from "react";
import { list, match, required, hasError, validateMany, anyErrors } from "./formValidation";


export const CustomerForm = ({ original, onSave }) => { 

    const [error, setError] = useState(false);

    const [ customer, setCustomer ] = useState(original); 

    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = ({ target }) => setCustomer((customer) => ({
        ...customer,
        [target.name]: target.value
    }));

    const validators = {
        firstName: required('First name is required'),
        lastName: required('Last name is required'),
        phoneNumber: list(
            required('Phone number is required'),
            match(/^[0-9+()\-]*$/, 'Only numbers, spaces and these symbols are allowed: () + -')
        )
    };
    
    const renderError = (fieldName) => (
        <span id={`${fieldName}Error`} role="alert">
            { hasError(validationErrors, fieldName) ? validationErrors[fieldName] : '' }
        </span>
    );

    const Error = ({ hasError }) => (
        <p role="alert">
            { hasError ? 'An error occurred during save' : '' }
        </p>
    );

    const handleBlur = ({ target }) => {
        const result = validateMany(validators, {
            [target.name]: target.value
        });
        setValidationErrors({
            ...validationErrors,
            ...result
        })
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationResult = validateMany(validators, customer);
        if (!anyErrors(validationResult)) {
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
        }
        else {
            // setValidationErrors(validationResult);
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
                onBlur={handleBlur}
                aria-describedby="lastNameError"
            />
            { renderError('lastName') }

            <label htmlFor="phoneNumber">Phone number</label>
            <input
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                value={customer.phoneNumber}
                onChange={handleChange}
                aria-describedby="phoneNumberError"
                onBlur={handleBlur}
            />
            { renderError('phoneNumber') }

            <input 
                type="submit" 
                value="Add" 
            />
        </form>
    )
};