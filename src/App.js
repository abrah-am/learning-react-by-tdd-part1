import React, { useState, useCallback } from "react";
import { AppointmentsDayViewLoader } from "./AppointmentsDayViewLoader";
import { CustomerForm } from "./CustomerForm";
import { CustomerSearch } from "./CustomerSearch";
import { AppointmentFormLoader } from "./AppointmentFormLoader";

const blankAppointment = {
    service: '',
    stylist: '',
    startAt: null,
};
const blankCustomer = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
};
export const App = () => {
    const [customer, setCustomer] = useState();

    const [view, setView] = useState("dayView");

    const transitionToAddCustomer = useCallback(()=> setView("addCustomer"), []);
    
    const transitionToDayView = useCallback(() => setView("dayView"), [])
    
    const transitionToSearchCustomers = useCallback(
        () => setView("searchCustomers"), []
      );
    
    const transitionToAddAppointment = useCallback((customer) => { 
        setCustomer(customer);
        setView("addAppointment");
    }, []);

    const searchActions = (customer) => (
        <button 
            onClick={() => 
                transitionToAddAppointment(customer)
            }
        >
            Create appointment
        </button>
    );

    switch (view) {
        case "addCustomer":
            return (
                <CustomerForm 
                    original={blankCustomer} 
                    onSave={transitionToAddAppointment} 
                />
            );
        case "searchCustomers":
            return (
                <CustomerSearch 
                    renderCustomerActions={searchActions}
                />
            );       
        case "addAppointment":
            return (
                <AppointmentFormLoader 
                    original={{...blankAppointment, customer: customer.id }} 
                    onSave={transitionToDayView} 
                />
            );
        default:
            return (
                <>
                    <menu>
                        <li>
                            <button type="button" onClick={transitionToAddCustomer}>
                                Add customer and appointment
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={transitionToSearchCustomers}
                            >
                                Search customers
                            </button>
                        </li>
                    </menu>
                    <AppointmentsDayViewLoader />
                </>                
            );
    }
};