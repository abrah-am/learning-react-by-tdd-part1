import React from "react";
import { initializeReactContainer, render, element, form, field, click, submit  } from "./reactTestExtensions";
import { CustomerForm } from '../src/CustomerForm'


describe('CustomerForm', () => {
    beforeEach(() => {
        initializeReactContainer();
    });

    const blankCustomer = { firstName: "" };

    it('renders a form', () => {
        render(<CustomerForm original={blankCustomer}/>);
        expect(form()).not.toBeNull();
    });

    it('renders the first name field as text box', () => {
        render(<CustomerForm original={blankCustomer}/>);
        expect(field("firstName")).not.toBeNull();
        expect(field("firstName").tagName).toEqual("INPUT");
        expect(field("firstName").type).toEqual('text');
    });

    it('includes the existing value for the first name', () => {
        const customer = { firstName: "Ashley" };
        render(<CustomerForm original={customer} />);
        expect(field("firstName").value).toEqual("Ashley");
    });

    it('renders a laber for the first name field', () => {
        render(<CustomerForm original={blankCustomer} />);
        const label = element('label[for=firstName]');
        expect(label).not.toBeNull();
    });

    it('renders a "First name" as the first name label content', () => {
        render(<CustomerForm original={blankCustomer} />);
        const label = element('label[for=firstName]');
        expect(label).toContainText("First name");
    });

    it('assigns an id that matches the label id to the first name field', () => {
        render(<CustomerForm original={blankCustomer} />);
        expect(field('firstName').id).toEqual("firstName");

    });

    it('renders a submit button', () => {
        render(<CustomerForm original={blankCustomer} />);
        const button = element('input[type=submit]');
        expect(button).not.toBeNull();
    });

    it('saves existing first name when submitted', () => {
        // tells Jest that it should expect at least one assertion to occur.
        expect.hasAssertions();
        const customer = { firstName: "Ashley" };
        render(
            <CustomerForm 
                original={customer} 
                onSubmit={ ({firstName}) => expect(firstName).toEqual("Ashley")} />
        );
        const button = element('input[type=submit]');
        click(button);
    });

    it('prevents the default action when sumitting the form', () => {
        render(<CustomerForm original={blankCustomer} onSubmit={() => {}} />);
        const event = submit(form());
        expect(event.defaultPrevented).toBe(true);
    });
});