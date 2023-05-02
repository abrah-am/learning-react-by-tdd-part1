import React from "react";
import { field, form, initializeReactContainer, render } from "./reactTestExtensions";
import { AppointmentForm } from "../src/AppointmentForm";

describe('AppointmentForm', () => {

    beforeEach(() => {
        initializeReactContainer();
    });

    const blankAppointment = {
        service: ''
    };

    const labelsOfAllOptions = (selectElement) => Array.from(selectElement.childNodes, (node) => node.textContent);

    const findOption = (selectBox, textContent) => {
        const options = Array.from(selectBox.childNodes);
        return options.find(option => option.textContent === textContent);
    };

    it('renders a form', () => {
        render(<AppointmentForm original={blankAppointment} />);
        expect(form()).not.toBeNull();
    });

    describe('service field', () => {
        const services = ['Haircut', 'Blow-dry'];

        it('renders a select box', () => {
            render(<AppointmentForm original={blankAppointment} />);

            expect(field('service')).not.toBe(undefined);
            expect(field('service').tagName).toEqual('SELECT');
        });

        it('has a blank value as the first value', () => {
            render(<AppointmentForm original={blankAppointment} />);
            const firstOption = field('service').childNodes[0];

            expect(firstOption.value).toEqual('');
        });

        it('lists all salon services', () => {
            render(
                <AppointmentForm 
                    original={blankAppointment} 
                    selectableServices={services} />);

            expect(labelsOfAllOptions(field('service'))).toEqual(expect.arrayContaining(services));
        })

        it('pre-selects the existing value [editing]', () => {
            const appointment = { service: 'Blow-dry'};
            render(
                <AppointmentForm 
                    selectableServices={services}
                    original={appointment}
                />
            );
            const option = findOption(field('service'), 'Blow-dry');
            expect(option.selected).toBe(true);
        });
    });
});