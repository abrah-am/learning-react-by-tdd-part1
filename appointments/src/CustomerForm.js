import React from "react";

export const CustomerForm = ({ original, onSubmit }) => { 
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(original);
    };
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="firstName">First name</label>
            <input id="firstName" type="text" name="firstName" value={original.firstName} readOnly />
            <input type="submit" value="Add" />
        </form>
    )
};