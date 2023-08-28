import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { list, match, required, hasError, validateMany, anyErrors } from "./formValidation";


const addCustomerRequest = (customer) => ({
    type: 'ADD_CUSTOMER_REQUEST',
    customer
});

export const CustomerForm = ({ original, onSave }) => { 

    const { 
        error, 
        status,
        validationErrors: serverValidationErrors,
    } = useSelector(({ customer }) => customer);

    const [ customer, setCustomer ] = useState(original); 

    const submitting = status === 'SUBMITTING';

    const [validationErrors, setValidationErrors] = useState({});

    const dispatch = useDispatch();

    const handleChange = ({ target }) => {
        setCustomer((customer) => ({
            ...customer,
            [target.name]: target.value
        }));
        if(hasError(validationErrors, target.name)) {
            validateSingleField(target.name, target.value);
        }
    };

    const validators = {
        firstName: required('First name is required'),
        lastName: required('Last name is required'),
        phoneNumber: list(
            required('Phone number is required'),
            match(/^[0-9+()\-]*$/, 'Only numbers, spaces and these symbols are allowed: () + -')
        )
    };
    
    const renderError = fieldName => {
        const allValidationErrors = {
            ...validationErrors,
            ...serverValidationErrors
        };
        return (
            <span id={`${fieldName}Error`} role="alert">
                { hasError(allValidationErrors, fieldName) ? allValidationErrors[fieldName] : '' }
            </span>
        )
    }

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

    const validateSingleField = (fieldName, fieldValue) => {
        const result = validateMany(validators, {
            [fieldName]: fieldValue
        });
        setValidationErrors({
            ...validationErrors,
            ...result   
        });
    }

    const doSave = async () => {
        const result = await global.fetch('/customers', { 
            method: "POST",
            credentials: 'same-origin',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer),
        });
        if (result.ok) {
            const customerWithId = await result.json();
            onSave(customerWithId);
        } else if (result.status === 422) {
            const response = await result.json();
            setValidationErrors(response.errors)
        } else {
        }

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationResult = validateMany(validators, customer);
        if (!anyErrors(validationResult)) {
            await doSave();
            dispatch(addCustomerRequest(customer))
        }
        else {
            setValidationErrors(validationResult);
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
                disabled={submitting}
            />
            {
                submitting ? (<span className="submittingIndicator" />) : null
            }
            
        </form>
    )
};