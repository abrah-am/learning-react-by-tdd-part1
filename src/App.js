import React, { useState, useCallback } from "react";
import { AppointmentsDayViewLoader } from "./AppointmentsDayViewLoader";
import { CustomerForm } from "./CustomerForm";
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
    const [view, setView] = useState("dayView");
    const transitionToAddCustomer = useCallback(()=> setView("addCustomer"), []);
    const transitionToAddAppointment = useCallback(() => { setView("addAppointment") }, []);

    switch (view) {
        case "addCustomer":
            return (
                <CustomerForm original={blankCustomer} onSave={transitionToAddAppointment} />
            );
        case "addAppointment":
            return (
                <AppointmentFormLoader original={blankAppointment} />
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