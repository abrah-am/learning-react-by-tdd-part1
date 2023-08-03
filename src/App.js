import React, { useState, useCallback } from "react";
import { AppointmentsDayViewLoader } from "./AppointmentsDayViewLoader";
import { CustomerForm } from "./CustomerForm";
import { AppointmentFormLoader } from "./AppointmentFormLoader";
import { act } from "react-dom/test-utils";

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
    const [view, setView] = useState("dayView");

    const transitionToAddCustomer = useCallback(()=> setView("addCustomer"), []);
    
    const transitionToDayView = useCallback(() => setView("dayView"), [])
    
    const transitionToAddAppointment = useCallback((customer) => { 
        setCustomer(customer);
        setView("addAppointment");
    }, []);
    
    const [customer, setCustomer] = useState();

    switch (view) {
        case "addCustomer":
            return (
                <CustomerForm original={blankCustomer} onSave={transitionToAddAppointment} />
            );
        case "addAppointment":
            return (
                <AppointmentFormLoader original={{...blankAppointment, customer: customer.id }} onSave={transitionToDayView} />
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
                    </menu>
                    <AppointmentsDayViewLoader />
                </>                
            );
    }
};