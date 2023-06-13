import { toContainText } from "./matchers/toContainText";
import { toHaveClass } from "./matchers/toHaveClass";
import { toBeInputFieldOfType } from "./matchers/toBeInputFieldOfType";
import { toBeElementWithTag } from "./matchers/toBeElementWithTag";
import { toBeRendered} from "./matchers/toBeRendered"
import { 
    toBeRenderedWithProps,
    toBeFirstRenderedWithProps
} from "./matchers/toBeRenderedWithProps";


expect.extend({
    toContainText, 
    toHaveClass,
    toBeInputFieldOfType,
    toBeElementWithTag,
    toBeRendered,
    toBeRenderedWithProps,
    toBeFirstRenderedWithProps,
});
