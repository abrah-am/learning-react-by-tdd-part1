import { matcherHint, printExpected } from 'jest-matcher-utils';


export const toBeInputFieldOfType = (element, expectedType) => {
    const pass = element?.tagName === 'INPUT' && element.type === expectedType;
    const sourceHint = () => matcherHint('toBeInputFieldOfType', 'element', printExpected(expectedType), {isNot: pass});

    const message = () => sourceHint();
    return { pass,  message };
};