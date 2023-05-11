import { toContainText } from "./matchers/toContainText";
import { toHaveClass } from "./matchers/toHaveClass";
import { toBeInputFieldOfType } from "./matchers/toBeInputFieldOfType";
import { toBeElementWithTag } from "./matchers/toBeElementWithTag";


expect.extend({
    toContainText, 
    toHaveClass,
    toBeInputFieldOfType,
    toBeElementWithTag,
    toBeCalled(recived) {
        if(recived.receivedArguments() === undefined) {
            return {
                pass: false,
                message: () => "Spy was not called.",
            }
        }
        return {
            pass: true,
            message: () => "Spy was called"
        }
    }
});
