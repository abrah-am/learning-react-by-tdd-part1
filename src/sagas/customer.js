import { put } from 'redux-saga/effects';

export function* addCustomer() {
    yield put( 
        { type: 'ADD_CUSTOMER_SUBMITTING' } 
    );
}