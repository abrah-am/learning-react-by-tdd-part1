import { toBeElementWithTag } from "./toBeElementWithTag";

describe('toBeElementWithTag matcher', () => {
    const stripTerminalColor = (text) =>
        text.replace(/\x1B\[\d+m/g, "");

    const elementFrom = (text) => {
        const parent = document.createElement("div");
        parent.innerHTML = text;
        return parent.firstChild;
    };
        
    it('returns pass=true when element with right tag is found', () => {
        const domElement = elementFrom('<input />');
        const result = toBeElementWithTag(domElement, 'input');

        expect(result.pass).toBe(true);
    });

    it('returns pass=false when element passed is null', () => {
        const result = toBeElementWithTag(null, 'input');

        expect(result.pass).toBe(false);
    });

    it('returns pass=false when element is of the wrong type', () => {
        const domElement = elementFrom('<input />');
        const result = toBeElementWithTag(domElement, 'select');

        expect(result.pass).toBe(false);
    });

    it('returns a message that contains the source line if no match', () => {
        const domElement = elementFrom('<input />');
        const result = toBeElementWithTag(domElement, 'select');

        expect(stripTerminalColor(result.message)).toMatch(`expect(element).toBeElementWithTag("select")`);
    });

    it('returns a message that contains the source line if negated match', () => {
        const domElement = elementFrom('<input />');
        const result = toBeElementWithTag(domElement, 'input');

        expect(stripTerminalColor(result.message)).toMatch(`expect(element).not.toBeElementWithTag("input")`);
    });

    it('returns a specific message the element passed is null', () => {
        const result = toBeElementWithTag(null, 'input');

        expect(stripTerminalColor(result.message)).toMatch(`Actual: element was not found`);
    });

    it('returns a message when the element has the wrong tag', () => {
        const domElement = elementFrom('<input />');
        const result = toBeElementWithTag(domElement, 'select');

        expect(stripTerminalColor(result.message)).toMatch(`Actual: <input>`);
    });
});