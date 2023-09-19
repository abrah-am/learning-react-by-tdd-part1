
const verifyStatusOk = result => {
    if(!result.ok) {
        return Promise.reject(new Error(500));
    } else {
        return result;
    }
};

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