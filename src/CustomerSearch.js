import React, { useCallback, useEffect, useState } from "react";


const SearchButtons = (
    { 
        handleNext,
        handlePrevious,
    }
) => (
    <menu>
        <li>
            <button onClick={handlePrevious}>Previous</button>
        </li>
        <li>
            <button onClick={handleNext}>Next</button>
        </li>
    </menu>
);

const CustomerRow = ({ customer }) => (
    <tr>
        <td>{customer.firstName}</td>
        <td>{customer.lastName}</td>
        <td>{customer.phoneNumber}</td>
    </tr>
);

export const CustomerSearch = () => {    

    const [customers, setCustomers] = useState([]);
    const [queryStrings, setQueryStrings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleNext = useCallback(() => {
        const after = customers[customers.length - 1].id;
        const newQueryString = `?after=${after}`;
        setQueryStrings([...queryStrings, newQueryString]);
    }, [customers, queryStrings]);

    const handlePrevious = useCallback(() => 
        setQueryStrings(queryStrings.slice(0, -1)), [queryStrings]);
    
    const handleSearchTextChanged = ({target: { value }}) => setSearchTerm(value);


    useEffect(() => {
        const fetchData = async () => {
            let queryString = '';
            if (queryStrings.length > 0 && searchTerm !== '') {
                queryString = queryStrings[queryStrings.length - 1] + `&searchTerm=${searchTerm}`
            }
            else if (searchTerm !== '') {
                queryString = `?searchTerm=${searchTerm}`
            } 
            else if(queryStrings.length > 0) {
                queryString = queryStrings[queryStrings.length - 1] || '';
            }
            const result = await global.fetch(`/customers${queryString}`, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            setCustomers(await result.json());
        }
        fetchData();    
    }, [queryStrings, searchTerm]);

    return (
        <>
            <input 
                placeholder="Enter filter text" 
                value={searchTerm}
                onChange={handleSearchTextChanged}
            />
            <SearchButtons handleNext={handleNext} handlePrevious={handlePrevious} />
            <table>
                <thead>
                    <tr>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Phone number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        customers.map (customer => (
                            <CustomerRow customer={customer} key={customer.id} />
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}