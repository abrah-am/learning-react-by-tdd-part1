import React, { useCallback, useState } from "react";

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
    handleChange,
} ) => {
    const startsAt = mergeDateAndTime(date, timeSlot);
    if(availableTimeSlots.some((ats) => (ats.startsAt === startsAt))) {
        const isChecked = startsAt === checkedTimeSlot;
        return(
            <input 
                name="startsAt"
                type="radio" 
                value={startsAt}
                checked={isChecked} 
                onChange={handleChange}
                readOnly/>
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
    handleChange,
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
                                    handleChange={handleChange}
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
    selectableStylist,
    servicesStylist,
    salonOpensAt,
    salonClosesAt,
    today,
    availableTimeSlots,
    onSubmit,
}) => {

    const [appointment, setAppointment] = useState(original);

    // useCallback: 
    const handleStartsAtChange = useCallback(({ target: { value }}) => 
        setAppointment((appointment) => ({
            ...appointment,
            startsAt: parseInt(value),
        })),
        []
    );
        
    const handleSelectBoxChange = ({ target: {value, name}}) => {
        setAppointment((appointment) => ({
            ...appointment,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(appointment);
    };

    const stylistsForService = appointment.service ? servicesStylist[appointment.service] : selectableStylist;
    const timeSlotsForStylist = appointment.stylist ? availableTimeSlots.filter((slot) => slot.stylists.includes(appointment.stylist)) : availableTimeSlots;

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="service">Service:</label>
            <select id="service" name="service" value={original.service} onChange={handleSelectBoxChange}>
                <option />
                {
                    selectableServices.map(s => 
                        (<option key={s}>{s}</option>))
                }
            </select>
            <label htmlFor="stylist">Stylist:</label>
            <select id="stylist" name="stylist" value={original.stylist} onChange={handleSelectBoxChange}>
                <option />
                {
                    stylistsForService.map((s) => (
                        <option key={s}>{s}</option>
                    ))
                }
            </select>
            <TimeSlotTable 
                salonOpensAt={salonOpensAt} 
                salonClosesAt={salonClosesAt} 
                today={today}
                availableTimeSlots={timeSlotsForStylist}
                checkedTimeSlot={appointment.startsAt}
                handleChange={handleStartsAtChange}
            />
            <input type="submit" value="Add" />
        </form>)
};

AppointmentForm.defaultProps = {
    salonOpensAt: 9,
    salonClosesAt: 19,
    selectableServices: [
        'Haircut',
        'Blow-dry',
        'Cut & Color',
        'Beard trim',
        'Haircut & beard trim',
        'Extensions'
    ],
    selectableStylist: [
        'Ashley',
        'Jo',
        'Pat',
        'Sam'
    ],
    servicesStylist: {
        Haircut: ['Ashely', 'Jo', 'Pat', 'Sam'],
        'Blow-dry': ['Ashely', 'Jo', 'Pat', 'Sam'],
        'Cut & Color': ['Ashely', 'Jo'],
        'Beard trim': ['Pat', 'Sam'],
        'Haircut & beard trim': ['Pat', 'Sam'],
        Extensions: ['Ashely', 'Pat']
    },
    today: new Date(),
    onSubmit: null,
};