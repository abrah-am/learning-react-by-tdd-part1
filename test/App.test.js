import React from "react";
import { element, render, click, propsOf, renderAdditional, renderWithRouter, linkFor } from "./reactTestExtensions";
import { App } from "../src/App";
import { initializeReactContainer } from "./reactTestExtensions";
import { AppointmentsDayViewLoader } from "../src/AppointmentsDayViewLoader";
import { AppointmentFormLoader } from "../src/AppointmentFormLoader"
import { AppointmentFormRoute } from "../src/AppointmentFormRoute";
import { CustomerSearchRoute } from "../src/CustomerSearchRoute";
import { CustomerForm } from "../src/CustomerForm";
import { blankCustomer } from "./builders/customer";
import { blankAppointment } from "./builders/appointment";
import { CustomerSearch } from "../src/CustomerSearch/CustomerSearch";

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

jest.mock("../src/CustomerSearch/CustomerSearch", () => ({
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

    it('renders a link to the /addCustomer route', async () => {
        renderWithRouter(<App />);
        expect(linkFor('/addCustomer')).toBeDefined();
    });

    it('captions the /addCustomer link as "Add customer and appointment"', async () => {
        renderWithRouter(<App />);
        expect(linkFor('/addCustomer')).toContainText("Add customer and appointment");
    });

    it('displays the CustomerSearch when link is clicked', async () => {
        renderWithRouter(<App />);
        click(linkFor('/searchCustomers'));
        expect(CustomerSearchRoute).toBeRendered();
    });
});