import React from "react";
import { initializeReactContainer, render, element, form, field, click, submit, submitButton, change, labelFor  } from "./reactTestExtensions";
import { CustomerForm } from '../src/CustomerForm'


describe('CustomerForm', () => {

    const originalFetch = global.fetch;
    let fetchSpy;

    beforeEach(() => {
        initializeReactContainer();
        fetchSpy = spy();
        global.fetch = fetchSpy.fn;
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    const blankCustomer = { 
        firstName: "",
        lastName: "", 
        phoneNumber: "",
    };

    const spy = () => {
        let receivedArguments;
        return {
            fn: (...args) => (receivedArguments = args),
            receivedArguments: () => receivedArguments,
            receivedArgument: n => receivedArguments[n]
        };
    }

    it('renders a form', () => {
        render(<CustomerForm original={blankCustomer}/>);
        expect(form()).not.toBeNull();
    });

    const itRendersAsATextBox = (fieldName) => 
        it('renders as text box', () => {
            render(<CustomerForm original={blankCustomer}/>);
            expect(field(fieldName)).toBeInputFieldOfType('text');
    });    
        
    const itIncludesTheExistingValue = (fieldName, existing) => 
        it('includes the existing value', () => {
            const customer = { [fieldName]: existing };
            render(<CustomerForm original={customer} />);
            expect(field(fieldName).value).toEqual(existing);
    });

    const itRendersLabel = (fieldName, labelText) => {
        it('renders a label for the text box', () => {
            render(<CustomerForm original={blankCustomer} />);
            expect(labelFor(fieldName)).not.toBeNull();
        }); 

        it('renders a label text as the label content', () => {
            render(<CustomerForm original={blankCustomer} />);
            expect(labelFor(fieldName)).toContainText(labelText);
        });
    
    };

    const itAssignesIdMatchingLabelId = (fieldName) => it('assigns an id that matches the label id', () => {
        render(<CustomerForm original={blankCustomer} />);
        expect(field(fieldName).id).toEqual(fieldName);

    });

    const itSubmitsExistingValue = (fieldName, value) => it('saves existing value when submitted', () => {
        const customer = { [fieldName]: value };
        render(
            <CustomerForm original={customer} />
        );
        click(submitButton());
        expect(fetchSpy).toBeCalledWith(expect.anything(), expect.objectContaining({
            body: JSON.stringify(customer)
        }));
    });

    const itSubmitsNewValue = (fieldName, value) => it('saves new value when submitted', () => {
        render(
            <CustomerForm original={blankCustomer} />
        );
        change(field(fieldName), value);
        click(submitButton());
        expect(fetchSpy).toBeCalledWith(expect.anything(), expect.objectContaining({
            body: JSON.stringify({
                ...blankCustomer,
                [fieldName] : value,
            })
        }));
    });


    describe('first name field', () => {
        itRendersAsATextBox('firstName');
        itIncludesTheExistingValue('firstName', 'Ashley');
        itRendersLabel('firstName', 'First name');
        itAssignesIdMatchingLabelId('firstName');
        itSubmitsExistingValue('firstName', 'Ashley');
        itSubmitsNewValue('firstName', 'Jamie');
    });

    describe('last name field', () => {
        itRendersAsATextBox('lastName');
        itIncludesTheExistingValue('lastName', 'Smith');
        itRendersLabel('lastName', 'Last name');
        itAssignesIdMatchingLabelId('lastName');
        itSubmitsExistingValue('lastName', 'Smith');
        itSubmitsNewValue('lastName', 'Test2');
    });

    describe('phone number field', () => {
        itRendersAsATextBox('phoneNumber');
        itIncludesTheExistingValue('phoneNumber', '1234567890');
        itRendersLabel('phoneNumber', 'Phone number');
        itAssignesIdMatchingLabelId('phoneNumber');
        itSubmitsExistingValue('phoneNumber', '1234567890');
        itSubmitsNewValue('phoneNumber', '0987654321');
    });

    it('renders a submit button', () => {
        render(<CustomerForm original={blankCustomer} />);
        expect(submitButton()).not.toBeNull();
    });

    it('prevents the default action when sumitting the form', () => {
        render(<CustomerForm original={blankCustomer} />);
        const event = submit(form());
        expect(event.defaultPrevented).toBe(true);
    });

    it('sends request POST /customers when submitting the form', () => {
        render(<CustomerForm original={blankCustomer} />);
        click(submitButton());
        expect(fetchSpy).toBeCalledWith('/customers', expect.objectContaining(
            { method: "POST" }));
    });

    it('calls fetch with the right configuration', () => {
        render(<CustomerForm original={blankCustomer} />);
        click(submitButton());
        expect(fetchSpy).toBeCalledWith(expect.anything(), expect.objectContaining(
            { credentials: "same-origin", headers: { "Content-Type": "application/json" } }));
    });
});