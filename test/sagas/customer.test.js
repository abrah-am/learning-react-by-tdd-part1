import { expectRedux, storeSpy } from "expect-redux";
import { configureStore } from "../../src/store";

describe('addCustomer', () => {
    let store;
    beforeEach(() => {
        store = configureStore([storeSpy])
    });

    const addCustomerRequest = (customer) => ({
        type: 'ADD_CUSTOMER_REQUEST',
        customer
    });

    it('sets current status to submitting', () => {
        store.dispatch(addCustomerRequest());
        return expectRedux(store)
            .toDispatchAnAction()
            .matching({
                type: 'ADD_CUSTOMER_SUBMITTING'
            });
    });
});