import {
    fetchResponseOk,
    fetchResponseError    
} from './builders/fetch';
import {
    performFetch
} from '../src/relayEnvironment';

describe('performFetch', () => {
    let response = {
        data: { id: 123 }
    };

    const text = 'test';

    const variables = { a: 123 };

    beforeEach(() => {
        jest
            .spyOn(global, 'fetch')
            .mockResolvedValue(
                fetchResponseOk(response)
            );
    });

    it('sends HTTP request to POST /graphl', () => {
        performFetch({ text }, variables);
        expect(global.fetch).toBeCalledWith(
            '/graphql',
            expect.objectContaining({
                method: 'POST'
            })
        );
    });

    it('calls fetch with the correct configuration', () => {
        performFetch({ text }, variables);
        expect(global.fetch).toBeCalledWith(
            '/graphql',
            expect.objectContaining({
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        );
    });

    it('calls fetch with query and variables as request body', async () => {
        performFetch({ text }, variables);
        expect(global.fetch).toBeCalledWith(
            '/graphql',
            expect.objectContaining({
                body: JSON.stringify({
                    query: text,
                    variables
                })
            })
        );
    });
});