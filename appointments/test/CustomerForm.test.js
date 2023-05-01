import React from "react";
import { initializeReactContainer, render, element, form, field, click, submit, submitButton, change  } from "./reactTestExtensions";
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

    const itRendersAsATextBox = (fieldName) => 
        it('renders as text box', () => {
            render(<CustomerForm original={blankCustomer}/>);
            expect(field(fieldName)).not.toBeNull();
            expect(field(fieldName).tagName).toEqual("INPUT");
            expect(field(fieldName).type).toEqual('text');
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
            const label = element(`label[for=${fieldName}]`);
            expect(label).not.toBeNull();
        }); 

        it('renders a "First Name" as the first name label content', () => {
            render(<CustomerForm original={blankCustomer} />);
            const label = element(`label[for=${fieldName}]`);
            expect(label).toContainText(labelText);
        });
    
    };

    const itAssignesIdMatchingLabelId = (fieldName) => it('assigns an id that matches the label id', () => {
        render(<CustomerForm original={blankCustomer} />);
        expect(field(fieldName).id).toEqual(fieldName);

    });

    const itSaveExistingValueAtSubmit = (fieldName, value) => it('saves existing value when submitted', () => {
        // tells Jest that it should expect at least one assertion to occur.
        expect.hasAssertions();
        const customer = { [fieldName]: value };
        console.log(customer);
        render(
            <CustomerForm 
                original={customer} 
                onSubmit={ (props) => expect(props[fieldName]).toEqual(value)} />
        );
        click(submitButton());
    });

    const itSavesNewValueWhenSubmitted = (fieldName, value) => it('saves new value when submitted', () => {
        expect.hasAssertions();
        render(
            <CustomerForm
                original={blankCustomer}
                onSubmit={( props ) => expect(props[fieldName]).toEqual(value)}
            />
        );
        change(field(fieldName), value);
        click(submitButton());
    });


    describe('first name field', () => {
        itRendersAsATextBox('firstName');
        itIncludesTheExistingValue('firstName', 'Ashley');
        itRendersLabel('firstName', 'First name');
        itAssignesIdMatchingLabelId('firstName');
        itSaveExistingValueAtSubmit('firstName', 'Ashley');
        itSavesNewValueWhenSubmitted('firstName', 'Jamie');
    });

    it('renders a submit button', () => {
        render(<CustomerForm original={blankCustomer} />);
        expect(submitButton()).not.toBeNull();
    });

    it('prevents the default action when sumitting the form', () => {
        render(<CustomerForm original={blankCustomer} onSubmit={() => {}} />);
        const event = submit(form());
        expect(event.defaultPrevented).toBe(true);
    });
});