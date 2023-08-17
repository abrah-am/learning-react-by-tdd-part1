import React from "react";
import {
  initializeReactContainer,
  renderAndWait,
  clickAndWait,
  change,
  element,
  elements,
  textOf,
  buttonWithLabel,
  changeAndWait,
  render,
  renderAdditional,
  click,
} from "../reactTestExtensions";
import { SearchButtons } from "../../src/CustomerSearch/SearchButtons";
import { CustomerSearch } from "../../src/CustomerSearch/CustomerSearch";
import { fetchResponseOk } from "../builders/fetch";

jest.mock(
  "../../src/CustomerSearch/SearchButtons",
  () => ({
    SearchButtons: jest.fn(() => (
      <div id="SearchButtons" />
    )),
  })
);

const oneCustomer = [
    {
        id: 1,
        firstName: 'A',
        lastName: 'B',
        phoneNumber: '1'
    }
];

const twoCustomers = [
    {
        id: 1,
        firstName: 'A',
        lastName: 'B',
        phoneNumber: '1'
    },
    {
        id: 2,
        firstName: 'C',
        lastName: 'D',
        phoneNumber: '2'
    }
];

const testProps = {
  navigate: jest.fn(),
  renderCustomerActions: jest.fn(() => {}),
  searchTerm: "",
  lastRowIds: [],
};

const tenCustomers = Array.from('0123456789', id => ({ id }));

const anotherTenCustomers = Array.from('ABCDEFGHIJ', id => ({ id }));

const lessThanTenCustomers = Array.from("0123456", id => ({ id }));

const twentyCustomers = Array.from("0123456789ABCDEFGHIJ", id => ({ id }));

describe("CustomerSearch", () => {
  beforeEach(() => {
    initializeReactContainer();
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(fetchResponseOk([]));
  });

  it('renders a table with four headings', async () => {
    await renderAndWait(<CustomerSearch {...testProps} />);
    const headings = elements("table th");
    expect(textOf(headings)).toEqual([
        "First name",
        "Last name",
        "Phone number",
        "Actions"
    ]);
  });

  it('fetches all customer data when component mounts', async () => {
    await renderAndWait(<CustomerSearch {...testProps} />);
    expect(global.fetch).toBeCalledWith('/customers', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            "Content-Type": "application/json"
        }
    });
  });

  it('renders all customer data in a table row', async () => {
    global.fetch.mockResolvedValue(fetchResponseOk(oneCustomer));
    await renderAndWait(<CustomerSearch {...testProps} />);
    const columns = elements('table > tbody > tr > td');
    expect(columns[0]).toContainText('A');
    expect(columns[1]).toContainText('B');
    expect(columns[2]).toContainText('1');
  });

  it('renders multiple customer rows', async () => {
    global.fetch.mockResolvedValue(fetchResponseOk(twoCustomers));
    await renderAndWait(<CustomerSearch {...testProps} />);
    const rows = elements('table tbody tr');
    expect(rows[1].childNodes[0]).toContainText('C');
  });


  // SEARCH - DESCRIBE
  it('renders a text field for a search term', async () => {
    await renderAndWait(<CustomerSearch { ...testProps }/>);
    expect(element('input')).not.toBeNull();
  });

  it('has a search input field with a placeholde', async () => {
    await renderAndWait(<CustomerSearch { ...testProps }/>);
    expect(
      element('input').getAttribute('placeholder')
    ).toEqual('Enter filter text');
  });
  
  it("changes location when search term is changed", async () => {
    let navigateSpy = jest.fn();
    await renderAndWait(
      <CustomerSearch
        {...testProps}
        navigate={navigateSpy}
      />
    );
    change(element("input"), "name");
    expect(navigateSpy).toBeCalledWith(
      "?searchTerm=name"
    );
  });

  it('displays provided action buttons for each customers', async () => {
    const actionSpy = jest.fn(() => 'actions');
    global.fetch.mockResolvedValue(fetchResponseOk(oneCustomer));
    await renderAndWait(
      <CustomerSearch 
        { ...testProps }
        renderCustomerActions={actionSpy}
      />
    );
    const rows = elements('table tbody td');
    expect(rows[rows.length - 1]).toContainText('actions');
  });

  it('passes customer to the renderCustomerActions prop', async () => {
    const actionSpy = jest.fn(() => 'actions');
    global.fetch.mockResolvedValue(fetchResponseOk(oneCustomer));
    await renderAndWait(
      <CustomerSearch 
      { ...testProps }
      renderCustomerActions={actionSpy}
      />
    );
    expect(actionSpy).toBeCalledWith(oneCustomer[0]);
  });
});
