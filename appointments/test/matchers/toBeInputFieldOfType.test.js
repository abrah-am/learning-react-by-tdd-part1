import { toBeInputFieldOfType } from "./toBeInputFieldOfType";

describe('toBeInputFieldOfType', () => {

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
        const element = createElement('<input type="date" />');
        const result = toBeInputFieldOfType(element, 'text');
        expect(result.message()).toMatch('expect(element).not.toBeInputFieldTypeOf("text")');
    });
});