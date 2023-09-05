import React from "react";
import { 
    initializeReactContainer, render, element, 
    form, field, click, submit, submitButton, change, 
    labelFor, clickAndWait, submitAndAwait, withFocus, textOf, elements, renderWithStore, store, dispatchToStore  } from "./reactTestExtensions";
import { CustomerForm } from '../src/CustomerForm'
import { bodyOfLastFetchRequest } from "./spyHelpers";
import { fetchResponseError, fetchResponseOk } from "./builders/fetch";
import { blankCustomer, validCustomer } from "./builders/customer";
import { act } from "react-dom/test-utils";
import { expectRedux } from "expect-redux";


describe('CustomerForm', () => {

    let fetchSpy;

    beforeEach(() => {
        initializeReactContainer();
        fetchSpy = jest
            .spyOn(global, 'fetch')
            .mockResolvedValue(fetchResponseOk({}));
    });

    it('renders a form', () => {
        renderWithStore(<CustomerForm original={blankCustomer}/>);
        expect(form()).not.toBeNull();
    });

    const itRendersAsATextBox = (fieldName) => 
        it('renders as text box', () => {
            renderWithStore(<CustomerForm original={blankCustomer}/>);
            expect(field(fieldName)).toBeInputFieldOfType('text');
    });    
        
    const itIncludesTheExistingValue = (fieldName, existing) => 
        it('includes the existing value', () => {
            const customer = { [fieldName]: existing };
            renderWithStore(<CustomerForm original={customer} />);
            expect(field(fieldName).value).toEqual(existing);
    });

    const itRendersLabel = (fieldName, labelText) => {
        it('renders a label for the text box', () => {
            renderWithStore(<CustomerForm original={blankCustomer} />);
            expect(labelFor(fieldName)).not.toBeNull();
        }); 

        it('renders a label text as the label content', () => {
            renderWithStore(<CustomerForm original={blankCustomer} />);
            expect(labelFor(fieldName)).toContainText(labelText);
        });
    
    };

    const itAssignesIdMatchingLabelId = (fieldName) => it('assigns an id that matches the label id', () => {
        renderWithStore(<CustomerForm original={blankCustomer} />);
        expect(field(fieldName).id).toEqual(fieldName);

    });

    const itSubmitsExistingValue = (fieldName, value) => it('saves existing value when submitted', async () => {
        const customer = { 
            ...validCustomer,
            [fieldName]: value 
        };
        renderWithStore(
            <CustomerForm original={customer} onSave={() => {}} />
        );
        await clickAndWait(submitButton());
        expect(bodyOfLastFetchRequest()).toMatchObject(customer);
    });

    const itSubmitsNewValue = (fieldName, value) => it('saves new value when submitted', async () => {
        renderWithStore(
            <CustomerForm original={validCustomer} onSave={() => {}} />
        );
        change(field(fieldName), value);
        await clickAndWait(submitButton());
        expect(bodyOfLastFetchRequest()).toMatchObject({
            [fieldName]: value,
        })
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

    it('renders error message when error prop is true', async () => {
        renderWithStore(
            <CustomerForm original={validCustomer} />
        );
        await clickAndWait(submitButton());
        dispatchToStore(
            { type: 'ADD_CUSTOMER_FAILED' }
        );
        expect(element('[role=alert]')).toContainText('error occurred');
    });

    it('prevents the default action when sumitting the form', async () => {
        renderWithStore(<CustomerForm original={validCustomer} />);
        const event = await submitAndAwait(form());
        expect(event.defaultPrevented).toBe(true);
    });

    it('sends request POST /customers when submitting the form', async () => {
        renderWithStore(<CustomerForm original={validCustomer} onSave={() => {}} />);
        await clickAndWait(submitButton());
        expect(global.fetch).toBeCalledWith('/customers', expect.objectContaining(
            { method: "POST" }));
    });

    it('dispatches ADD_CUSTOMER_REQUEST when submitting data', async () => {
        renderWithStore(
            <CustomerForm original={validCustomer}  onSave={() => {}} />
        );
        await clickAndWait(submitButton());
        return expectRedux(store)
            .toDispatchAnAction()
            .matching({
                type: 'ADD_CUSTOMER_REQUEST',
                customer: validCustomer
            });
    });

    it('calls fetch with the right configuration', async () => {
        renderWithStore(<CustomerForm original={validCustomer} onSave={() => {}} />);
        await clickAndWait(submitButton());
        expect(global.fetch).toBeCalledWith(expect.anything(), expect.objectContaining(
            { credentials: "same-origin", headers: { "Content-Type": "application/json" } }));
    });

    it('renders an alert space', async () => {
        renderWithStore(<CustomerForm original={blankCustomer} />);
        expect(element('[role=alert]')).not.toBeNull();
    });

    it('initially has no text in the alert space', async () => {
        renderWithStore(<CustomerForm original={blankCustomer} />);
        expect(element('[role=alert]')).not.toContainText('error occurred')
    });

    describe('validation', () => {

        const errorFor = (fieldName) => element(`#${fieldName}Error[role=alert]`);

        const itRendersAlertForFieldValidation = (fieldName) => {
            it(`renders an alert space for ${fieldName} validation errors`, () => {
                renderWithStore(<CustomerForm original={blankCustomer} />);
                expect(errorFor(fieldName)).not.toBeNull();
            });
        };
        const itSetsAlertAsAccessibleDescriptionForField = (fieldName) => {
            it(`sets alert as accessible description for the  ${fieldName} field`, async () => {
                renderWithStore(<CustomerForm original={blankCustomer} />);
                expect(field(fieldName).getAttribute('aria-describedby')).toEqual(`${fieldName}Error`);
            });
        };
        const itInvalidatesFieldWithValue = (
            fieldName,
            value,
            description
        ) => {
            it(`displays error after blur when ${fieldName} field is ${value}`, () => {
                renderWithStore(<CustomerForm original={blankCustomer} />);
                withFocus(field(fieldName), () => change(field(fieldName), value));
                expect(errorFor(fieldName)).toContainText(description);
            });
        };
        const itInitiallyHasNoTextInTheAlertSpace = (fieldName) => {
            it(`initially has not text in the ${fieldName} field alert space`, async () => {
                renderWithStore(<CustomerForm original={blankCustomer} />);
                expect(errorFor(fieldName).textContent).toEqual('');
            });
        };

        it('accepts standard phone number characters when validating', () => {
            renderWithStore(<CustomerForm original={blankCustomer} />);
            withFocus(
                field('phoneNumber'), () => change(field('phoneNumber'), '0123456789+()-')
            );
            expect(errorFor('phoneNumber')).not.toContainText('Only numbers');
        });

        itRendersAlertForFieldValidation('firstName');
        itRendersAlertForFieldValidation('lastName');
        itRendersAlertForFieldValidation('phoneNumber');
        
        itSetsAlertAsAccessibleDescriptionForField('firstName');
        itSetsAlertAsAccessibleDescriptionForField('lastName');
        itSetsAlertAsAccessibleDescriptionForField('phoneNumber');

        itInvalidatesFieldWithValue('firstName', '', 'First name is required');
        itInvalidatesFieldWithValue('lastName', ' ', 'Last name is required');
        itInvalidatesFieldWithValue('phoneNumber', '', 'Phone number is required');
        itInvalidatesFieldWithValue('phoneNumber', 'invalid', 'Only numbers, spaces and these symbols are allowed: () + -')

        itInitiallyHasNoTextInTheAlertSpace('firstName');
        itInitiallyHasNoTextInTheAlertSpace('lastName');
        itInitiallyHasNoTextInTheAlertSpace('phoneNumber')

        const itClearsFieldError = (fieldName, fieldValue) => {
            it(`clears ${fieldName} error when user corrects it`, async () => {
                renderWithStore(<CustomerForm original={validCustomer} />);
                withFocus(field(fieldName), () => 
                    change(field(fieldName), "")
                );
                withFocus(field(fieldName), () => 
                    change(field(fieldName), fieldValue)
                );
                expect(
                    errorFor(fieldName).textContent
                ).toEqual('');
            });
        }

        itClearsFieldError('firstName', 'name');
        itClearsFieldError('lastName', 'name');
        itClearsFieldError('phoneNumber', '1234567890');

        const itDoesNotInvalidateFieldOnKeypress = (
            fieldName,
            fieldValue
          ) => {
            it(`does not invalidate ${fieldName} field on keypress`, async () => {
              renderWithStore(
                <CustomerForm original={validCustomer} />
              );
      
              change(field(fieldName), fieldValue);
      
              expect(
                errorFor(fieldName).textContent
              ).toEqual("");
            });
        };

        itDoesNotInvalidateFieldOnKeypress('firstName', '');
        itDoesNotInvalidateFieldOnKeypress('lastName', '');
        itDoesNotInvalidateFieldOnKeypress('phoneNumber', '');
      

        it('does not submit the form when there are validation erros', async () => {
            renderWithStore(<CustomerForm original={blankCustomer} />);
            await clickAndWait(submitButton());
            return expectRedux(store)
                .toNotDispatchAnAction(100)
                .ofType('ADD_CUSTOMER_REQUEST')
        });

        it('renders validation errors after submission fails', async() => {
            renderWithStore(<CustomerForm original={blankCustomer} />);
            await clickAndWait(submitButton());
            expect(textOf(elements('[role=alert]'))).not.toEqual("");
        });

        it('renders field validation errors from server', async () => {
            const errors = {
                phoneNumber: 'Phone number already exists in the system'
            }
            renderWithStore(<CustomerForm original={validCustomer} />);
            dispatchToStore(
                {
                    type: 'ADD_CUSTOMER_VALIDATION_FAILED',
                    validationErrors: errors
                }
            );
            expect(errorFor('phoneNumber')).toContainText(errors.phoneNumber);
        })
    });

    describe('submitting indicator', () => {
        it('displays indicator when form is submitting', async () => {
            renderWithStore(
                <CustomerForm original={validCustomer} onSave={() => {}} />
            );
            dispatchToStore(
                { type: 'ADD_CUSTOMER_SUBMITTING' }
            );
            expect(element('span.submittingIndicator')).not.toBeNull();
        });

        it('initially does not display the submitting indicator', () => {
            renderWithStore(<CustomerForm original={validCustomer} />);
            expect(element('.submittingIndicator')).toBeNull();
        });

        it('hides indicator when form has submitted', async () => {
            renderWithStore(
                <CustomerForm original={validCustomer} onSave={() => {}} />
            );
            dispatchToStore(
                { type: 'ADD_CUSTOMER_SUCCESSFUL' }
            );
            expect(element('.submittingIndicator')).toBeNull();

        })
    })

    describe('submit button', () => {        
        it('renders a submit button', () => {
            renderWithStore(<CustomerForm original={blankCustomer} />);
            expect(submitButton()).not.toBeNull();
        });

        it('disables the submit button when submitting', async () => {
            renderWithStore(
                <CustomerForm original={validCustomer} onSave={() => {}} />
            );
            dispatchToStore(
                { type: 'ADD_CUSTOMER_SUBMITTING' }
            );
            expect(submitButton().disabled).toBeTruthy();
        });

        it('initially does not disable submit button', () => {
            renderWithStore(<CustomerForm original={blankCustomer} />);
            expect(submitButton().disabled).toBeFalsy();
        });
    });
});