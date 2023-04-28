import React from 'react';
import ReactDOM from 'react-dom/client';
import { Appointment, AppointmentsDayView } from '../src/AppointmentsDayView';
import { act } from 'react-dom/test-utils';
import { initializeReactContainer, click, render, element, elements, textOf, typesOf  } from './reactTestExtensions';

describe("Appointment", () => {
    const blankCustomer = {
        firstName: "",
        lastName: "",
        phoneNumber: "",
    };

    beforeEach(() => {
        initializeReactContainer();
    })
    
    const appointmentViewTable = () => element("#appointmentView > table");

    it("renders a table", () => {
        render(<Appointment customer={blankCustomer} />);
        expect(appointmentViewTable()).not.toBeNull();
    });

    it("renders a customer first name", () => {
        const customer = { firstName: "Ashley" };
        render(<Appointment customer={customer} />);
        expect(appointmentViewTable()).toContainText("Ashley");
    });
    
    it("renders another customer first name", () => {
        const customer = { firstName: "Jordan" };
        render(<Appointment customer={customer} />);
        expect(appointmentViewTable()).toContainText("Jordan");
    });

    it("renders a customer last name", () => {
        const customer = { lastName: "Jones" };
        render(<Appointment customer={customer} />);
        expect(appointmentViewTable()).toContainText("Jones");
    });

    it("renders another customer last name", () => {
        const customer = { lastName: "Smith" };
        render(<Appointment customer={customer} />);
        expect(appointmentViewTable()).toContainText("Smith");
    });

    it("renders a customer phone number", () => {
        const customer = { phoneNumber: "123456789" };
        render(<Appointment customer={customer} />);
        expect(appointmentViewTable()).toContainText("123456789");
    });

    it("renders another customer phone number", () => {
        const customer = { phoneNumber: "234567890" };
        render(<Appointment customer={customer} />);
        expect(appointmentViewTable()).toContainText("234567890");
    });

    it("renders stylist name", () => {
        render(<Appointment customer={blankCustomer} stylist="Sam"/>);
        expect(appointmentViewTable().textContent).toContain("Sam");
    });

    it("renders another stylist name", () => {
        render(<Appointment customer={blankCustomer} stylist="Jo"/>);
        expect(appointmentViewTable().textContent).toContain("Jo");
    });

    it("renders salon service", () => {
        render(<Appointment customer={blankCustomer} service="Haircut"/>);
        expect(appointmentViewTable().textContent).toContain("Haircut");
    });

    it("renders another salon service", () => {
        render(<Appointment customer={blankCustomer} service="Blow-dry"/>);
        expect(appointmentViewTable().textContent).toContain("Blow-dry");
    });

    it("renders a note", () => {
        render(<Appointment customer={blankCustomer} notes="This is a note"/>);
        expect(appointmentViewTable().textContent).toContain("This is a note");
    });

    it("renders another note", () => {
        render(<Appointment customer={blankCustomer} notes="This is another note"/>);
        expect(appointmentViewTable().textContent).toContain("This is another note");
    });

    it("renders an h3 title element", () => {
        render(<Appointment customer={blankCustomer} />);
        expect(element("h3")).not.toBeNull();
    });

    it("renders the time as the heading", () => {
        const today = new Date();
        const timestamp = today.setHours(9, 0, 0);
        render(<Appointment customer={blankCustomer} startsAt={timestamp} />);
        expect(element("h3")).toContainText("Today's appointment at 09:00");
    });

});

describe("AppointmentsDayView", () => {
    const today = new Date();
    const appointments = [{ 
        startsAt: today.setHours(12, 0), 
        customer: { firstName: "Ashley " }
    }, { 
        startsAt: today.setHours(13, 0), 
        customer: { firstName: "Jordan "}  
    }];
    
    beforeEach(() => {
        initializeReactContainer();
    })
    
    const secondButton = () => elements("button")[1];

    it("initially shows a meesage saying there are no appointments today", () => {
        render(<AppointmentsDayView appointments={[]} />);
        expect(document.body).toContainText("There are no appointments scheduled for today");
    });

    it("renders a div with the right id", () => {
        render(<AppointmentsDayView appointments={[]} />);
        expect(element("div#appointmentsDayView")).not.toBeNull();
    });

    it("renders an ol element to display appointments", () => {
        render(<AppointmentsDayView appointments={[]} />);
        const listElement = element("ol");
        expect(listElement).not.toBeNull();
    });

    it("renders an li for each appointment", () => {
        render(<AppointmentsDayView appointments={appointments} />);
        const listAppointments = elements("ol > li");
        expect(listAppointments).toHaveLength(2);
    });

    it("renders an li for each appointment", () => {
        render(<AppointmentsDayView appointments={appointments} />);
        const listAppointments = elements("ol > li");
        expect(listAppointments).toHaveLength(2);
    });

    it("renders the time of each appointment", () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(textOf(elements("li"))).toEqual(["12:00", "13:00"])
    });

    it("selects the first appointment by default", () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(document.body).toContainText("Ashley");
    });

    it("has a button element in each li", () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(typesOf(elements("li > *"))).toEqual(["button", "button"]);
    });

    it("renders another appointment when selected", () => {
        render(<AppointmentsDayView appointments={appointments} />);
        click(secondButton());
        expect(document.body).toContainText("Jordan");
    });

    it('adds toggle class to button when selected', () => {
        render(<AppointmentsDayView appointments={appointments} />);
        click(secondButton());
        expect(secondButton()).toHaveClass('toggled');
    });

    it('adds shouldn\'t have class toggled when not selected', () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(secondButton()).not.toHaveClass('toggled');
    });

})