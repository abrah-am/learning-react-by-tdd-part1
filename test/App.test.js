import React from "react";
import { element, render, click, propsOf, renderAdditional, renderWithRouter } from "./reactTestExtensions";
import { App } from "../src/App";
import { initializeReactContainer } from "./reactTestExtensions";
import { AppointmentsDayViewLoader } from "../src/AppointmentsDayViewLoader";
import { AppointmentFormLoader } from "../src/AppointmentFormLoader"
import { AppointmentFormRoute } from "../src/AppointmentFormRoute";
import { CustomerSearchRoute } from "../src/CustomerSearchRoute";
import { CustomerForm } from "../src/CustomerForm";
import { blankCustomer } from "./builders/customer";
import { blankAppointment } from "./builders/appointment";
import { CustomerSearch } from "../src/CustomerSearch";

import { act } from "react-dom/test-utils";

jest.mock('../src/AppointmentFormRoute', () => ({
    AppointmentFormRoute: jest.fn(() => (
      <div id="AppointmentFormRoute" />
    )),
  }));

jest.mock('../src/CustomerSearchRoute', () => ({
    CustomerSearchRoute: jest.fn(() => (
      <div id="CustomerSearchRoute" />
    )),
}));

jest.mock('../src/AppointmentsDayViewLoader', () => ({
    AppointmentsDayViewLoader: jest.fn(() => (
        <div id='AppointmentsDayViewLoader' />
    )),
}))

jest.mock("../src/CustomerSearch", () => ({
    CustomerSearch: jest.fn(() => (
      <div id='CustomerSearch' />
    )),
}));

jest.mock('../src/CustomerForm', () => ({
    CustomerForm: jest.fn(() => (
        <div id='CustomerForm' />
    )),
}));

jest.mock('../src/AppointmentFormLoader', () => ({
    AppointmentFormLoader: jest.fn(() => (
        <div id="AppointmentFormLoader" />
    ))
}));

describe('App', () => {
    const beginAddingCustomerAndAppointment = () => 
        click(element('menu > li > button:first-of-type'));

    const exampleCustomer = { id: 123 };
    const saveCustomer = (customer = exampleCustomer) => act(() => propsOf(CustomerForm).onSave(customer));

    beforeEach(() => {
        initializeReactContainer();
    });

    it('initially shows the AppointmentDayViewLoader', () => {
        renderWithRouter(<App />);        
        expect(AppointmentsDayViewLoader).toBeRendered();
    });

    it('has a menu bar', () => {
        renderWithRouter(<App />);
        expect(element("menu")).not.toBeNull();
    });

    it('renders CustomerForm at the /addCustomer endpoint', () => {
        renderWithRouter(<App />, {
            location: '/addCustomer'
        });
        expect(CustomerForm).toBeRendered();
    });

    it('renders AppointmentFormRoute at /addAppointment', () => {
        renderWithRouter(<App />, {
            location: '/addAppointment?customer=123'
        });
        expect(AppointmentFormRoute).toBeRendered();
    });

    it('renders CustomerSearchRoute at /searchCustomers', () => {
        renderWithRouter(<App />, {
            location: "/searchCustomers",
          });
        expect(CustomerSearchRoute).toBeRendered();
    });

    it('has a button to initiate add customer and appointment action', () => {
        renderWithRouter(<App />);
        const firstButton = element("menu > li > button:first-of-type");
        expect(firstButton).toContainText("Add customer and appointment");
    });

    it('displays the CustomerForm when button is clicked', async() => {
        renderWithRouter(<App />);
        beginAddingCustomerAndAppointment();
        expect(element('#CustomerForm')).not.toBeNull();
    });

    it('passes a blank original customer object to CustomerForm', async() => {
        renderWithRouter(<App />);
        beginAddingCustomerAndAppointment();
        expect(CustomerForm).toBeRenderedWithProps(
            expect.objectContaining({ original: blankCustomer })
        )
    });

    it('hides the AppointmentViewLoader when the button is clicked', async() => {
        renderWithRouter(<App />);
        beginAddingCustomerAndAppointment();
        expect(element('#AppointmentsDayViewLoader')).toBeNull();
    });

    it('hides the button bar when CustomerForm is being displayed', async() => {
        renderWithRouter(<App />);
        beginAddingCustomerAndAppointment();
        expect(element("menu")).toBeNull();
    });

    it('displays the AppointmentFormLoader after the CustomerForm is submitted', async () => {
        renderWithRouter(<App />);
        beginAddingCustomerAndAppointment();
        saveCustomer();
        expect(element('#AppointmentFormLoader')).not.toBeNull();
    });

    it('passes a blank original appointment object to CustomerForm', async () => {
        renderWithRouter(<App />);
        beginAddingCustomerAndAppointment();
        saveCustomer();
        expect(AppointmentFormLoader).toBeRenderedWithProps(
            expect.objectContaining({
                original: expect.objectContaining(blankAppointment),
            })
        );
    });

    const saveAppointment = () => act(() => propsOf(AppointmentFormLoader).onSave());
    
    it('passes the customer to the AppointmentForm', async () => {
        const customer = { id: 123 };
        render(<App />);
        beginAddingCustomerAndAppointment();
        saveCustomer(customer);
        expect(AppointmentFormLoader).toBeRenderedWithProps(
            expect.objectContaining({
                original: expect.objectContaining({
                    customer: customer.id
                }),
            })
        );
    });

    it('renders AppointmentDayViewLoader after AppointmentForm is submitted', async () => {
        renderWithRouter(<App />);
        beginAddingCustomerAndAppointment();
        saveCustomer();
        saveAppointment();
        expect(AppointmentsDayViewLoader).toBeRendered();
    });

    describe("search customers", () => {

        it("has a button to search customers", () => {
            renderWithRouter(<App />);
          const secondButton = element(
            "menu > li:nth-of-type(2) > button"
          );
          expect(secondButton).toContainText(
            "Search customers"
          );
        });
    
        const navigateToSearchCustomers = () =>
          click(
            element('menu > li:nth-of-type(2) > button')
          );
    
        it("displays the CustomerSearch when button is clicked", async () => {
            renderWithRouter(<App />);
          navigateToSearchCustomers();
          expect(
            element("#CustomerSearch")
          ).not.toBeNull();
        });

        const searchFor = (customer) => 
            propsOf(CustomerSearch)
            .renderCustomerActions(customer);

        it('passes a button to the CustomerSearch named Create appointment', async () => {
            renderWithRouter(<App />);
            navigateToSearchCustomers();
            const buttonContainer = renderAdditional(searchFor());
            expect(buttonContainer.firstChild).toBeElementWithTag('button');
            expect(buttonContainer.firstChild).toContainText('Create appointment');
        });

        it('clicking appointment button shows the appointment form for that customer', async () => {
            const customer = { id: 123 };
            renderWithRouter(<App />);
            navigateToSearchCustomers();
            const buttonContainer = renderAdditional(searchFor(customer));
            click(buttonContainer.firstChild);
            expect(element('#AppointmentFormLoader')).not.toBeNull();
            expect(propsOf(AppointmentFormLoader).original).toMatchObject({ customer: 123 });
          });
    });
});