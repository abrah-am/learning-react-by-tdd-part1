import React from "react";
import { change, click, clickAndWait, element, elements, field, form, initializeReactContainer, labelFor, render, submitButton } from "./reactTestExtensions";
import { AppointmentForm } from "../src/AppointmentForm";
import { today, todayAt, tomorrowAt } from "./builders/time";
import { fetchResponseError, fetchResponseOk } from "./builders/fetch";
import { bodyOfLastFetchRequest } from "./spyHelpers";
import { blankAppointment } from "./builders/appointment";



describe('AppointmentForm', () => {

    beforeEach(() => {
        initializeReactContainer();
        jest.spyOn(global, 'fetch').mockResolvedValue(fetchResponseOk({}));
    });

    const services = ['Haircut', 'Blow-dry'];
    const stylists = ['Ashely', 'Jo'];

    const availableTimeSlots = [
        {
            startsAt: todayAt(9),
            stylists: ['Ashely', 'Jo'],
        },
        {
            startsAt: todayAt(9, 30),
            stylists: ['Ashely', 'Jo'],
        }
    ];

    const testProps = {
        today,
        selectableServices: services,
        selectableStylist: stylists,
        availableTimeSlots,
        original: blankAppointment,
    };

    const labelsOfAllOptions = (selectElement) => Array.from(selectElement.childNodes, (node) => node.textContent);

    const findOption = (selectBox, textContent) => {
        const options = Array.from(selectBox.childNodes);
        return options.find(option => option.textContent === textContent);
    };

    const startsAtField = (index) => elements('input[name=startsAt]')[index];

    it('renders a form', () => {
        render(<AppointmentForm { ...testProps } />);

        expect(form()).not.toBeNull();
    });

    it('renders a submit button', () => {
        render(<AppointmentForm { ...testProps } />);

        expect(submitButton()).not.toBeNull();
    });

    it('calls fetch with the right properties when submitting data', async () => {
        render(<AppointmentForm {...testProps} />);
        await clickAndWait(submitButton());
        expect(global.fetch).toBeCalledWith(
            '/appointments',
            expect.objectContaining({
                method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }
            })
        );
    });

    it('notifies onSave when form is submitted', async () => {
        global.fetch.mockResolvedValue(fetchResponseOk({}));
        const saveSpy = jest.fn();
        render(<AppointmentForm {...testProps} onSave={saveSpy} />);
        await clickAndWait(submitButton());
        expect(saveSpy).toBeCalled();
    });

    it('does not notify onSave if the POST request returns an error', async () => {
        global.fetch.mockResolvedValue(fetchResponseError());
        const saveSpy = jest.fn();
        render(<AppointmentForm {...testProps} onSave={saveSpy} />);
        await clickAndWait(submitButton());
        expect(saveSpy).not.toBeCalled();
    });

    it('renders an alert space', async () => {
        render(<AppointmentForm {...testProps} />);
        expect(element('[role=alert]')).not.toBeNull();
    });

    it('initially has no text in the alert space', async() => {
        render(<AppointmentForm {...testProps} />);
        expect(element('[role=alert]')).not.toContainText('Error occurred');
    });

    it('renders error message when fetch call fails', async () => {
        global.fetch.mockResolvedValue(fetchResponseError());
        render(<AppointmentForm {...testProps} />);
        await clickAndWait(submitButton());
        expect(element('[role=alert]')).toContainText('Error occurred');
    });

    it('clears error message when fetch call succeeds', async() => {
        global.fetch.mockResolvedValueOnce(fetchResponseError());
        global.fetch.mockResolvedValueOnce(fetchResponseOk());
        render(<AppointmentForm {...testProps} />);
        await clickAndWait(submitButton());
        await clickAndWait(submitButton());
        expect(element('[role=alert]')).not.toContainText('Error occurred');
    });

    it.only('passes the customer id to fetch when submitting', async () => {
        const appointment = {
            ...blankAppointment,
            customer: '123'
        };

        render(
            <AppointmentForm { ...testProps } original={appointment}/>
        );
        await clickAndWait(submitButton());
        expect(bodyOfLastFetchRequest()).toMatchObject({
            customer: '123'
        });
    });

    const itRendersSelectBox = (fieldName) => it('renders a select box', () => {
        render(<AppointmentForm { ...testProps } />);
        expect(field(fieldName)).toBeElementWithTag('select');
    });

    const itRendersALabel = (fieldName, text) => {
        it('renders a Label', () => {
            render(<AppointmentForm { ...testProps } />);
            expect(labelFor(fieldName)).not.toBeNull();
        });
        it('renders a label with text', () => {
            render(<AppointmentForm { ...testProps } />);
            expect(labelFor(fieldName)).toContainText(text)
    
        });
    };

    const itInitiallyHasABlankValueChosen = (fieldName) => it('has a blank value as the first value', () => {
        render(<AppointmentForm { ...testProps } />);
        const firstOption = field(fieldName).childNodes[0];

        expect(firstOption.value).toEqual('');
    });

    const itPreselectsExistingValue = (fieldName, preselected) => it('pre-selects the existing value [editing]', () => {
        const appointment = { [fieldName]: preselected };
        render(<AppointmentForm { ...testProps } original={appointment} />);
        const option = findOption(field(fieldName), preselected);
        expect(option.selected).toBe(true);
    });

    const itSubmitsExistingValue = (fieldName, existing) => it('saves existing value when submitting', async () => {
        const appointment = { 
            [fieldName]: existing
        };
        render(<AppointmentForm 
            { ...testProps } 
            original={appointment} />);
        await clickAndWait(submitButton());
        expect(bodyOfLastFetchRequest()).toMatchObject({
            [fieldName]: existing 
        });
    });

    const itSubmitsNewValue = (fieldName, newValue) => it('saves new value when submitting', async () => {
        render(<AppointmentForm { ...testProps } />);
        change(field(fieldName), newValue);              
        await clickAndWait(submitButton());
        expect(bodyOfLastFetchRequest()).toMatchObject({
            [fieldName]: newValue 
        });
    });

    const itAssignsAnIdThatMatchesTheLabelId = (fieldName) => it('assigns an id that matches the label id', () => {
        render(<AppointmentForm { ...testProps } />);
        expect(field(fieldName).id).toEqual(fieldName)
    });

    describe('service field', () => {
        itRendersSelectBox('service');
        itRendersALabel('service', 'Service:');
        itInitiallyHasABlankValueChosen('service');
        itPreselectsExistingValue('service', 'Blow-dry');
        itSubmitsExistingValue('service', 'Haircut');
        itSubmitsNewValue('service', 'Blow-dry');
        itAssignsAnIdThatMatchesTheLabelId('service');

        it('lists all salon services', () => {
            render(
                <AppointmentForm 
                    { ...testProps }
                    selectableServices={services} />
            );

            expect(labelsOfAllOptions(field('service'))).toEqual(expect.arrayContaining(services));
        })
    });

    describe('stylist field', () => {
        itRendersSelectBox('stylist');
        itRendersALabel('stylist', 'Stylist:');
        itInitiallyHasABlankValueChosen('stylist');
        itPreselectsExistingValue('stylist', 'Jo');
        itSubmitsExistingValue('stylist', 'Jo');
        itSubmitsNewValue('stylist', 'Jo');
        itAssignsAnIdThatMatchesTheLabelId('stylist');

        it('list only stylist that can perform the selected service', () => {
            const selectableServices = ['1', '2'];
            const selectableStylist = ['A', 'B', 'C'];
            const serviceStylist = {
                1: ['A', 'B']
            };
            const appointment = { service: 1 };
            render(<AppointmentForm 
                    { ...testProps } 
                    selectableServices={selectableServices} 
                    selectableStylist={selectableStylist}
                    servicesStylist={serviceStylist} />);

            expect(labelsOfAllOptions(field('stylist'))).toEqual(expect.arrayContaining(['A', 'B']));

        });
    });

    describe('time slot table', () => {
                
        const cellsWithRadioButtons = () => elements('input[type=radio]').map((el) => elements('td').indexOf(el.parentNode));
        
        it('renders a table for time slots with an id', () => {
            render(<AppointmentForm { ...testProps } />);
            expect(element('table#time-slots')).not.toBeNull();
        });

        it('renders a time slot for every half an hour between open and close times', () => {
            render(
                <AppointmentForm 
                    { ...testProps }
                    salonOpensAt={9}
                    salonClosesAt={11}
                />
            );
            const timesOfDayHeadings = elements('tbody >* th');

            expect(timesOfDayHeadings[0]).toContainText('09:00');
            expect(timesOfDayHeadings[1]).toContainText('09:30');
            expect(timesOfDayHeadings[3]).toContainText('10:30');
        });

        it('renders an empty cell at the start of the header row', () => {
            render(<AppointmentForm { ...testProps } />);
            const headerRow = element('thead > tr');

            expect(headerRow.firstChild).toContainText("");
        });

        it('renders a week of available dates', () => {
            const specificDate = new Date(2018, 11, 1);
            render(<AppointmentForm { ...testProps } today={specificDate} />);
            const dates = elements('thead >* th:not(:first-child)');

            expect(dates).toHaveLength(7);
            expect(dates[0]).toContainText('Sat 01');
            expect(dates[1]).toContainText('Sun 02');
            expect(dates[6]).toContainText('Fri 07');
        });

        it('renders radio buttons in the correct table cell positions', () => {
            const availableTimeSlots = [
                { startsAt: todayAt(9), stylists: ['Ashley'] },
                { startsAt: todayAt(9, 30), stylists: ['Ashley'] },
                { startsAt: tomorrowAt(9,30), stylists: ['Ashley'] },
            ];
            render(<AppointmentForm {...testProps} availableTimeSlots={availableTimeSlots}/>);
            expect(cellsWithRadioButtons()).toEqual([0, 7, 8]);
        });

        it('does not render radio buttons for unavailable time slots', () => {
            render(
                <AppointmentForm
                    { ...testProps }
                    original={blankAppointment}
                    availableTimeSlots={[]}
                />
            );
            
            expect(elements('input[type=radio]')).toHaveLength(0);
        });

        it('sets a radio button values to the startsAt value of the corresponding appointment', () => {
            render(
                <AppointmentForm { ...testProps } />
            );
            const allRadioValues = elements('input[type=radio]').map(({ value }) => parseInt(value));
            const allSlotTimes = availableTimeSlots.map(({ startsAt }) => startsAt);

            expect(allRadioValues).toEqual(allSlotTimes);
        })

        it('pre-selects the existing value', () => {
            const appointment = {
                startsAt: availableTimeSlots[1].startsAt,
            }
            render(<AppointmentForm { ...testProps } original={appointment} />);
            expect(startsAtField(1).checked).toEqual(true);
        });

        it('saves existing value when submitted', async () => {
            const appointment = {
                startsAt: availableTimeSlots[1].startsAt,
            }
            render(
                <AppointmentForm
                    { ...testProps }
                    original={appointment}
                />
            );
            await clickAndWait(submitButton());
            expect(bodyOfLastFetchRequest()).toMatchObject({
                startsAt: availableTimeSlots[1].startsAt,
            });
        });

        it('saves new value when submitted', async () => {
            const appointment = {
                startsAt: availableTimeSlots[0].startsAt,
            }
            render(<AppointmentForm { ...testProps } original={appointment} />);
            await clickAndWait(startsAtField(1));
            await clickAndWait(submitButton());
            expect(bodyOfLastFetchRequest()).toMatchObject({
                startsAt: availableTimeSlots[1].startsAt,
            });
        });

        it('filters appointments by selected stylist', () => {
            const availableTimeSlots = [
                {
                    startsAt: todayAt(9),
                    stylists: ['Ashely'],
                },
                {
                    startsAt: todayAt(9, 30),
                    stylists: ['Jo']
                }
            ];

            render(<AppointmentForm { ...testProps } availableTimeSlots={availableTimeSlots} />);
            change(field('stylist'), 'Jo');
            expect(cellsWithRadioButtons()).toEqual([7]);
        });
        
    });

});