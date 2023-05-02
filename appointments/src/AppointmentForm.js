import React from "react";

export const timeIncrements = (times, start, increment) => Array(times)
    .fill([start])
    .reduce((acc, _, i) => acc.concat([start + i * increment]));

export const dailyTimeSlots = (opensAt, closesAt) => {
    const totalSlots = (closesAt - opensAt) * 2;
    const startTime = new Date().setHours(opensAt, 0, 0, 0);
    const increment = 30 * 60 * 1000;
    return timeIncrements(totalSlots, startTime, increment);
};

const toTimeValue = timestamp => new Date(timestamp).toTimeString().substring(0, 5);

const TimeSlotTable = ({ salonOpensAt, salonClosesAt}) => {
    const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
    return (
        <table id="time-slots">
            <tbody>
                {timeSlots.map(timeslotMillis => (
                    <tr key={timeslotMillis}>
                        <th>{toTimeValue(timeslotMillis)}</th>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export const AppointmentForm = ({
    original,
    selectableServices,
    salonOpensAt,
    salonClosesAt
}) => (
    <form>
        <select name="service" value={original.service} readOnly>
            <option />
            {
                selectableServices.map(s => 
                    ( <option key={s}>{s}</option> )
                )
            }
        </select>
        <TimeSlotTable 
            salonOpensAt={salonOpensAt} 
            salonClosesAt={salonClosesAt} 
        />
    </form>
);

AppointmentForm.defaultProps = {
    salonOpensAt: 9,
    salonClosesAt: 19,
    selectableServices: [
        'HairCut',
        'Blow-dry',
        'Cut & Color',
        'Beard Trim',
        'Haircut & beard trim',
        'Extensions'
    ]
};