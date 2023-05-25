import React from "react";
import {
  initializeReactContainer,
  element,
  renderAndAwait,
} from "./reactTestExtensions";
import { AppointmentsDayViewLoader } from "../src/AppointmentsDayViewLoader";
import { AppointmentsDayView } from "../src/AppointmentsDayView";
import { today, todayAt } from "./builders/time"
import { fetchResponseOK } from "./builders/fetch"

jest.mock("../src/AppointmentsDayView", () => ({
  AppointmentsDayView: jest.fn(() => (
    <div id="AppointmentsDayView" />
  )),
}));

describe('AppointmentsDayViewLoader', () => {

  const appointments = [
    { startsAt: todayAt(9) },
    { startsAt: todayAt(10) }
  ];

  beforeEach(() => {
    initializeReactContainer();
    jest.spyOn(global, 'fetch').mockResolvedValue(fetchResponseOK(appointments));
  });

  it('renders an AppointmentsDayView', async () => {
    await renderAndAwait(<AppointmentsDayViewLoader />);
    expect(element('#AppointmentsDayView')).not.toBeNull();
  });

  it('initially passes empty array of appointments to AppointmentsDayView', async () => {
    await renderAndAwait(<AppointmentsDayViewLoader />);
    expect(AppointmentsDayView).toBeCalledWith({ appointments: [] }, expect.anything());
  });

  it('fetches data when component is mounted', async () => {
    //From midnigth today to midnight tomorrow
    const from = todayAt(0);
    const to = todayAt(23, 59, 59, 999);
    await renderAndAwait(<AppointmentsDayViewLoader today={today} />);
    expect(global.fetch).toBeCalledWith(`/appointments/${from}-${to}`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/json"
      }
    });
  });
});
