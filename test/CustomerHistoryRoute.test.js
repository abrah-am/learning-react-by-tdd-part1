import React from 'react';
import {
    initializeReactContainer, renderWithRouter
} from './reactTestExtensions';
import { CustomerHistoryRoute } from '../src/CustomerHistoryRoute';
import { CustomerHistory } from '../src/CustomerHistory';

jest.mock('../src/CustomerHistory', () => ({
    CustomerHistory: jest.fn(() => (
        <div id='CustomerHistory'/>
    )),
}));

describe('CustomerHistoryRoute', () => {

    beforeEach(() => {
        initializeReactContainer();
    });

    it('renders CustomerHistory', () => {
        renderWithRouter(<CustomerHistoryRoute />);
        expect(CustomerHistory).toBeRendered();
    });

    it('add the customer id parameters', () => {
        renderWithRouter(<CustomerHistoryRoute />, {
            location: '?customer=123'
        });
        expect(CustomerHistory).toBeRenderedWithProps({
            id: '123'
        });
    });
});