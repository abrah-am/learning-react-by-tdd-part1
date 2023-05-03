import { toHaveClass } from "./toHaveClass";

describe('toHaveClass matcher', () => {
    const stripTerminalColor = (text) =>
    text.replace(/\x1B\[\d+m/g, "");

    it('returns true when class is found in the DOM element', () => {
        const domElement = { className: "class1" };
        const result = toHaveClass(domElement, 'class1');
        expect(result.pass).toBe(true);
    })

    it('returns false when class is NOT found in the DOM element', () => {
        const domElement = { className: "" };
        const result = toHaveClass(domElement, 'class1');
        expect(result.pass).toBe(false);
    })

    it('returns message that contains the source line of no match', () => {
        const domElement = { className: "" };
        const result = toHaveClass(domElement, 'class1');
        expect(stripTerminalColor(result.message())).toContain(`expect(element).toHaveClass("class1")`);
    });

    it('returns message that contains the source line for a negated match', () => {
        const domElement = { className: "class1" };
        const result = toHaveClass(domElement, 'class1');
        expect(stripTerminalColor(result.message())).toContain(`expect(element).not.toHaveClass("class1")`);
    });

    it('returns a message that contains the classes that match', () => {
        const domElement = { className: "class1" };
        const result = toHaveClass(domElement, 'class1');
        expect(stripTerminalColor(result.message())).toContain(`Actual classes: ["class1"]`);
    });

    it('returns an empty array if there are no classes that match', () => {
        const domElement = { className: "" };
        const result = toHaveClass(domElement, 'class1');
        expect(stripTerminalColor(result.message())).toContain(`Actual classes: []`);
    });
});