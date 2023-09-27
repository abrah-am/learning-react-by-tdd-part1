import React from "react"
import { CustomerHistory } from "./CustomerHistory"
import { useSearchParams } from "react-router-dom"

export const CustomerHistoryRoute = (props) => {
    const [params, _] = useSearchParams();

    return (
        <CustomerHistory id={params.get('customer')} />
    );
}