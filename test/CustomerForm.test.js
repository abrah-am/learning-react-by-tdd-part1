import React from "react";
import { 
    initializeReactContainer, render, element, 
    form, field, click, submit, submitButton, change, 
    labelFor, clickAndWait, submitAndAwait, withFocus, textOf, elements, renderWithStore, store  } from "./reactTestExtensions";
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

    const itSubmitsExistingValue = (fieldName, value) => it('saves existing value when submitted', async () => {
        const customer = { 
            ...validCustomer,
            [fieldName]: value 
        };
        render(
            <CustomerForm original={customer} onSave={() => {}} />
        );
        await clickAndWait(submitButton());
        expect(bodyOfLastFetchRequest()).toMatchObject(customer);
    });

    const itSubmitsNewValue = (fieldName, value) => it('saves new value when submitted', async () => {
        render(
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

    describe('when POST request returns an error', () => {

        beforeEach(() => {
            global.fetch.mockResolvedValueOnce(fetchResponseError());
        });

        it('does not notify onSave', async () => {
            const saveSpy = jest.fn();
            render(<CustomerForm original={validCustomer} onSave={saveSpy.fn} />);
            await clickAndWait(submitButton());
            expect(saveSpy).not.toBeCalled();
        });
    
        it('renders error message', async () => {
            render(<CustomerForm original={validCustomer} />);
            await clickAndWait(submitButton());
            expect(element('[role=alert]')).toContainText('error occurred');
        });

        it('clears error message when fetch call succeeds', async () => {            
            render(<CustomerForm original={validCustomer} onSave={() => {}}/>);
            await clickAndWait(submitButton());
            global.fetch.mockResolvedValueOnce(fetchResponseOk());
            await clickAndWait(submitButton());
            expect(element('[role=alert]')).not.toContainText('error occurred');
        });

    });


    it('prevents the default action when sumitting the form', async () => {
        render(<CustomerForm original={validCustomer} onSave={() => {}} />);
        const event = await submitAndAwait(form());
        expect(event.defaultPrevented).toBe(true);
    });

    it('sends request POST /customers when submitting the form', async () => {
        render(<CustomerForm original={validCustomer} onSave={() => {}} />);
        await clickAndWait(submitButton());
        expect(global.fetch).toBeCalledWith('/customers', expect.objectContaining(
            { method: "POST" }));
    });

    it.only('dispatches ADD_CUSTOMER_REQUEST when submitting data', async () => {
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
        render(<CustomerForm original={validCustomer} onSave={() => {}} />);
        await clickAndWait(submitButton());
        expect(global.fetch).toBeCalledWith(expect.anything(), expect.objectContaining(
            { credentials: "same-origin", headers: { "Content-Type": "application/json" } }));
    });

    it('notifies onSave when form is submitted', async () => {
        global.fetch.mockResolvedValue(fetchResponseOk(validCustomer));
        const saveSpy = jest.fn();
        render(<CustomerForm original={validCustomer} onSave={saveSpy} />);
        await clickAndWait(submitButton());
        expect(saveSpy).toBeCalledWith(validCustomer);
    });

    it('renders an alert space', async () => {
        render(<CustomerForm original={blankCustomer} />);
        expect(element('[role=alert]')).not.toBeNull();
    });

    it('initially has no text in the alert space', async () => {
        render(<CustomerForm original={blankCustomer} />);
        expect(element('[role=alert]')).not.toContainText('error occurred')
    });

    describe('validation', () => {

        const errorFor = (fieldName) => element(`#${fieldName}Error[role=alert]`);

        const itRendersAlertForFieldValidation = (fieldName) => {
            it(`renders an alert space for ${fieldName} validation errors`, () => {
                render(<CustomerForm original={blankCustomer} />);
                expect(errorFor(fieldName)).not.toBeNull();
            });
        };
        const itSetsAlertAsAccessibleDescriptionForField = (fieldName) => {
            it(`sets alert as accessible description for the  ${fieldName} field`, async () => {
                render(<CustomerForm original={blankCustomer} />);
                expect(field(fieldName).getAttribute('aria-describedby')).toEqual(`${fieldName}Error`);
            });
        };
        const itInvalidatesFieldWithValue = (
            fieldName,
            value,
            description
        ) => {
            it(`displays error after blur when ${fieldName} field is ${value}`, () => {
                render(<CustomerForm original={blankCustomer} />);
                withFocus(field(fieldName), () => change(field(fieldName), value));
                expect(errorFor(fieldName)).toContainText(description);
            });
        };
        const itInitiallyHasNoTextInTheAlertSpace = (fieldName) => {
            it(`initially has not text in the ${fieldName} field alert space`, async () => {
                render(<CustomerForm original={blankCustomer} />);
                expect(errorFor(fieldName).textContent).toEqual('');
            });
        };

        it('accepts standard phone number characters when validating', () => {
            render(<CustomerForm original={blankCustomer} />);
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
                render(<CustomerForm original={validCustomer} />);
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
              render(
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
            render(<CustomerForm original={blankCustomer} />);
            await clickAndWait(submitButton());
            expect(global.fetch).not.toBeCalled();
        });

        it('renders validation errors after submission fails', async() => {
            render(<CustomerForm original={blankCustomer} />);
            await clickAndWait(submitButton());
            expect(textOf(elements('[role=alert]'))).not.toEqual("");
        });

        it('renders field validation errors from server', async () => {
            const errors = {
                phoneNumber: 'Phone number already exists in the system'
            }
            global.fetch.mockResolvedValue(fetchResponseError(422, { errors }));
            render(<CustomerForm original={validCustomer} />);
            await clickAndWait(submitButton());
            expect(errorFor('phoneNumber')).toContainText(errors.phoneNumber);
        })
    });

    describe('submitting indicator', () => {
        it('displays when form is submitting', async () => {
            render(<CustomerForm original={validCustomer} onSave={() => {}} />);
            click(submitButton());
            await act(async () => {
                expect(element('span.submittingIndicator')).not.toBeNull();
            });
        });

        it('initially does not display the submitting indicator', () => {
            render(<CustomerForm original={validCustomer} />);
            expect(element('.submittingIndicator')).toBeNull();
        });

        it('hides after submission', async () => {
            render(
                <CustomerForm original={validCustomer} onSave={() => {}} />
            );
            await clickAndWait(submitButton());
            expect(element('.submittingIndicator')).toBeNull();

        })
    })

    describe('submit button', () => {        
        it('renders a submit button', () => {
            render(<CustomerForm original={blankCustomer} />);
            expect(submitButton()).not.toBeNull();
        });

        it('disables the submit button when submitting', async () => {
            render(<CustomerForm original={validCustomer} onSave={() => {}} />);
            click(submitButton());
            await act(async () => {
                expect(submitButton().disabled).toBeTruthy();
            });
        });

        it('initially does not disable submit button', () => {
            render(<CustomerForm original={blankCustomer} />);
            expect(submitButton().disabled).toBeFalsy();
        });
    });
});