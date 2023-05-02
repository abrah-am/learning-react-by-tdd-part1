import React from "react";

export const AppointmentForm = ({
    original,
    selectableServices
}) => (
    <form>
        <select name="service" value={original.service} readOnly>
            <option />
            {
                selectableServices.map(s => 
                    ( <option key={s}>{s}</option> )
                )
            }
        </select>
    </form>
);

AppointmentForm.defaultProps = {
    selectableServices: [
        'HairCut',
        'Blow-dry',
        'Cut & Color',
        'Beard Trim',
        'Haircut & beard trim',
        'Extensions'
    ]
};