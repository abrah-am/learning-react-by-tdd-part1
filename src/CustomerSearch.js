import React, { useCallback, useEffect, useState } from "react";
import { objectToQueryString } from "./objectToQueryString";


const ToggleButton = ({
    onClick,
    toggled,
    children,
}) => (
    <button 
        onClick={onClick}
        className={toggled ? 'toggled' : ''}
    >
        {children}
    </button>
);

const SearchButtons = (
    { 
        handleNext, 
        handlePrevious,
        hasPrevious,
        hasNext,
        limit,
        handleLimit,
    }
) => (
    <menu>
        <li>
            <ToggleButton
                onClick={() => handleLimit(10)}
                toggled={limit === 10}
            >
                10
            </ToggleButton>
            <ToggleButton
                onClick={() => handleLimit(20)}
                toggled={limit === 20}
            >
                20
            </ToggleButton>
            <ToggleButton
                onClick={() => handleLimit(50)}
                toggled={limit === 50}
            >
                50
            </ToggleButton>
            <ToggleButton
                onClick={() => handleLimit(100)}
                toggled={limit === 100}
            >
                100
            </ToggleButton>
        </li>
        <li>
            <button 
                onClick={handlePrevious}
                disabled={!hasPrevious}
            >
                Previous
            </button>
        </li>
        <li>
            <button 
                onClick={handleNext}
                disabled={!hasNext}
            >
                Next
            </button>
        </li>
    </menu>
);

const CustomerRow = ({ 
    customer,
    renderCustomerActions
}) => (
    <tr>
        <td>{customer.firstName}</td>
        <td>{customer.lastName}</td>
        <td>{customer.phoneNumber}</td>
        <td>{renderCustomerActions(customer)}</td>
    </tr>
);

export const CustomerSearch = (
    { renderCustomerActions }
) => {    

    const [customers, setCustomers] = useState([]);
    
    const [lastRowIds, setLastRowIds] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

    const [limit, setLimit] = useState(10);

    const handleNext = useCallback(() => {
        const currentLastRowId = customers[customers.length - 1].id;
        setLastRowIds([...lastRowIds, currentLastRowId]);
    }, [customers, lastRowIds]);

    const handlePrevious = useCallback(() => 
        setLastRowIds(lastRowIds.slice(0, -1)), [lastRowIds]);
    
    const handleSearchTextChanged = ({target: { value }}) => setSearchTerm(value);

    useEffect(() => {
        const fetchData = async () => {
            const after = lastRowIds[lastRowIds.length - 1];
            const queryString = objectToQueryString({
                after,
                searchTerm,
                limit: limit === 10 ? '' : limit,
            });
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
    }, [lastRowIds, searchTerm, limit]);

    const hasPrevious = lastRowIds.length > 0;
    const hasNext = customers.length === limit;

    return (
        <>
            <input 
                placeholder="Enter filter text" 
                value={searchTerm}
                onChange={handleSearchTextChanged}
            />
            <SearchButtons 
                handleNext={handleNext} 
                handlePrevious={handlePrevious} 
                hasPrevious={hasPrevious}
                hasNext={hasNext}
                handleLimit={setLimit}
                limit={limit}
            />
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
                            <CustomerRow 
                                customer={customer} 
                                key={customer.id} 
                                renderCustomerActions={renderCustomerActions}
                            />
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}

CustomerSearch.defaultProps = {
    renderCustomerActions: () => {}
};