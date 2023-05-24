import React from "react";
import {
  initializeReactContainer,
  element,
  render,
} from "./reactTestExtensions";
import { AppointmentsDayViewLoader } from "../src/AppointmentsDayViewLoader";


jest.mock("../src/AppointmentsDayView", () => ({
  AppointmentsDayView: jest.fn(() => (
    <div id="AppointmentsDayView" />
  )),
}));

describe("AppointmentsDayViewLoader", () => {

  beforeEach(() => {
    initializeReactContainer();
  });

  it("renders an AppointmentsDayView", () => {
    render(
      <AppointmentsDayViewLoader />
    );
    console.log(document.body.innerHTML);
    expect(
      element("#AppointmentsDayView")
    ).not.toBeNull();
  });

  
});
