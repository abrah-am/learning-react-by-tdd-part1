import { toContainText } from "./matchers/toContainText";
import { toHaveClass } from "./matchers/toHaveClass";
import { toBeInputFieldOfType } from "./matchers/toBeInputFieldOfType";
import { toBeElementWithTag } from "./matchers/toBeElementWithTag";


expect.extend({
    toContainText, 
    toHaveClass,
    toBeInputFieldOfType,
    toBeElementWithTag
});
