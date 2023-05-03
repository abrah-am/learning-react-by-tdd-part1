import { toBeInputFieldOfType } from "./toBeInputFieldOfType";

describe('toBeInputFieldOfType', () => {

    const stripTerminalColor = (text) => text.replace(/\x1B\[\d+m/g, "");

    const createElement = (elementStr) => {
        const parent = document.createElement("div");
        parent.innerHTML = elementStr;
        return parent.firstChild;

    }

    it('returns pass=true when input element of the right type is found', () => {
        const element = createElement('<input type="text" />');
        const result = toBeInputFieldOfType(element, 'text');

        expect(result.pass).toBe(true);
    });

    it('returns pass=false when the element is null', () => {
        const result = toBeInputFieldOfType(null, 'text');

        expect(result.pass).toBe(false);
    });

    it('returns pass=false when element is of the wrong tag', () => {
        const element = createElement('<p />');
        const result = toBeInputFieldOfType(element, 'text');

        expect(result.pass).toBe(false);
    }); 

    it('returns pass=false when element is of the wrong type', () => {
        const element = createElement('<input type="date" />');
        const result = toBeInputFieldOfType(element, 'text');

        expect(result.pass).toBe(false);
    });

    it('returns a message that contains the source line if the negated match', () => {
        const element = createElement('<input type="text" />');
        const result = toBeInputFieldOfType(element, 'text');
        
        expect(stripTerminalColor(result.message())).toMatch('expect(element).not.toBeInputFieldOfType("text")');
    });

    it('returns a specific message when the element passed is null', () => {
        const result = toBeInputFieldOfType(null, 'text');

        expect(stripTerminalColor(result.message())).toMatch(`Actual: element was not found`);
    });

    it('returns a message when the element has the wrong tag', () => {
        const element = createElement('<p />');
        const result = toBeInputFieldOfType(element, 'text');

        expect(stripTerminalColor(result.message())).toMatch(`Actual: <p>`);
    });

    it('returns a message when the input element has the wrong type', () => {
        const element = createElement('<input type="date" />');
        const result = toBeInputFieldOfType(element, 'text');

        expect(stripTerminalColor(result.message())).toMatch(`Actual: <input type="date" />`);
    });
});