import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';


export const toContainText = (received, expectedTest) => { 
    const pass = received.textContent.includes(expectedTest);
    const sourceHint = () => matcherHint("toContainText", "container", printExpected(expectedTest), { isNot: pass });
    const actualTextHint = () => "Actual text: " + printReceived(received.textContent);
    const message = () => [sourceHint(), actualTextHint()].join("\n\n");
    return { pass, message };
};
