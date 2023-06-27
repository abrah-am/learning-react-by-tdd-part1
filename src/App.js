import React, { useState, useCallback } from "react";
import { AppointmentsDayViewLoader } from "./AppointmentsDayViewLoader";
import { CustomerForm } from "./CustomerForm";

const blankCustomer = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
};
export const App = () => {
    const [view, setView] = useState("dayView");
    const transitionToAddCustomer = useCallback(()=> setView("addCustomer"), []);
    return (
        <>
            <menu>
                <li>
                    <button type="button" onClick={transitionToAddCustomer}>
                        Add customer and appointment
                    </button>
                </li>
            </menu>
            { view === "addCustomer" ? 
                (<CustomerForm original={blankCustomer}/>) : <AppointmentsDayViewLoader />
            } 
        </>
    )
};