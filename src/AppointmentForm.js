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

const mergeDateAndTime = (date, timeSlot) => {
    const time = new Date(timeSlot);
    return new Date(date).setHours(
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds());
};

const toShortDate = (timestamp) => {
    const [day, , dayOfMonth] = new Date(timestamp).toDateString().split(" ");
    return `${day} ${dayOfMonth}`;
};

const RadioButtonIfAvailable = (( {
    availableTimeSlots,
    date,
    timeSlot,
    checkedTimeSlot,
} ) => {
    const startsAt = mergeDateAndTime(date, timeSlot);
    if(availableTimeSlots.some((ats) => (ats.startsAt === startsAt))) {
        const isChecked = startsAt === checkedTimeSlot;
        return(
            <input 
                name="startsAt"
                type="radio" 
                value={startsAt}
                checked={isChecked} />
        );
    }
    return null;
})

const TimeSlotTable = ({ 
    salonOpensAt, 
    salonClosesAt,
    today,
    availableTimeSlots,
    checkedTimeSlot,
}) => {
    const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
    const dates = weeklyDateValues(today);

    return (
        <table id="time-slots">
            <thead>
                <tr>
                    <th />
                    {dates.map((d) => (
                        <th key={d}>{toShortDate(d)}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {timeSlots.map((timeSlot) => (
                    <tr key={timeSlot}>
                        <th>{toTimeValue(timeSlot)}</th>
                        {dates.map(date => (
                            <td key={date}>
                                <RadioButtonIfAvailable 
                                    availableTimeSlots={availableTimeSlots}
                                    date={date}
                                    timeSlot={timeSlot}
                                    checkedTimeSlot={checkedTimeSlot}
                                />                             
                            </td>
                        ))}
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
    availableTimeSlots,
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
            availableTimeSlots={availableTimeSlots}
            checkedTimeSlot={original.startsAt}
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
    availableTimeSlots: []
};