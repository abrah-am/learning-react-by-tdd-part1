import React from "react";
import { initializeReactContainer, renderAndAwait } from "./reactTestExtensions";
import { AppointmentFormLoader } from "../src/AppointmentFormLoader";
import { AppointmentForm } from '../src/AppointmentForm';
import { fetchResponseOK } from "./builders/fetch";
import { todayAt } from "./builders/time";

jest.mock('../src/AppointmentForm', () => ({
    AppointmentForm: jest.fn(() => (
        <div id='AppointmentForm' />
    ))
}));

describe('AppointmentFormLoader', () => {
    const availableTimeSlots = [{when: todayAt(9)}];


    beforeEach(() => {
        initializeReactContainer();
        jest.spyOn(global, "fetch").mockResolvedValue(fetchResponseOK(availableTimeSlots))
    });

    it('fetches data when component is mounted', async () => {
        await renderAndAwait(<AppointmentFormLoader />);
        expect(global.fetch).toBeCalledWith(
            '/availableTimeSlots', 
            expect.objectContaining({
                method: 'GET',
                credentials: 'same-origin'
            }));
    });

    it('initally passes no data to AppointmentForm', async() => {
        await renderAndAwait(<AppointmentFormLoader />);
        expect(AppointmentForm).toBeFirstRenderedWithProps({availableTimeSlots: []});
    });

    it('displays time slots that are fetched on mount', async() => {
        await renderAndAwait(<AppointmentFormLoader />);
        expect(AppointmentForm).toBeRenderedWithProps({
            availableTimeSlots,
        })
    });

    it('passes props through to children', async () => {
        await renderAndAwait(<AppointmentFormLoader testProp={123} />);
        expect(AppointmentForm).toBeRenderedWithProps(
            expect.objectContaining({ testProp: 123 })
        );
    });
});