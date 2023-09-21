
import {
    Environment,
    Network, 
    Store,
    RecordSource
} from 'relay-runtime';

let environment = null;

export const getEnvironment = () => environment || (environment = buildEnvironment());

export const buildEnvironment = () => 
    new Environment({
        network: Network.create(performFetch),
        store: new Store(new RecordSource())
    });

export const performFetch = (operation, variables) => 
    global
        .fetch('/graphql', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: operation.text,
                variables
            })
        })
        .then(verifyStatusOk)
        .then(
            result => result.json()        
        );

const verifyStatusOk = result => {
    if(!result.ok) {
        return Promise.reject(new Error(500));
    } else {
        return result;
    }
};