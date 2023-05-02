import React from "react";

const timeIncrements = (times, start, increment) => Array(times)
    .fill([start])
    .reduce((acc, _, i) => acc.concat([start + i * increment]));

const dailyTimeSlots = (opensAt, closesAt) => {
    const totalSlots = (closesAt - opensAt) * 2;
    const startTime = new Date().setHours(opensAt, 0, 0, 0);
    const increment = 30 * 60 * 1000;
    return timeIncrements(totalSlots, startTime, increment);
};

const toTimeValue = timestamp => new Date(timestamp).toTimeString().substring(0, 5);

const weeklyDateValues = (startDate) => {
    const midnight = startDate.setHours(0, 0, 0);
    const increment = 24 * 60 * 60 * 1000;
    return timeIncrements(7, midnight, increment);
};

const toShortDate = (timestamp) => {
    const [day, , dayOfMonth] = new Date(timestamp).toDateString().split(" ");
    return `${day} ${dayOfMonth}`;
};

const TimeSlotTable = ({ 
    salonOpensAt, 
    salonClosesAt,
    today
}) => {
    const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
    const dates = weeklyDateValues(today);

    return (
        <table id="time-slots">
            <thead>
                <tr>
                    <th />
                    {dates.map(d => (
                        <th key={d}>{toShortDate(d)}</th>
                    ))}
                </tr>
            </thead>
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
    salonClosesAt,
    today,
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
            today={today}
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
    ],
    today: new Date(),
};