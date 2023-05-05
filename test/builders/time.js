export const today = new Date();

export const todayAt = (hours, minutes=0, seconds=0, milliseconds=0) => 
    new Date(today).setHours(hours, minutes, seconds, milliseconds);

export const dayInMillis = 24 * 60 * 60 * 1000;

export const tomorrow = new Date(today.getTime() + dayInMillis);

export const tomorrowAt = (hours, minutes=0, seconds=0, milliseconds=0) => 
    new Date(tomorrow).setHours(hours, minutes, seconds, milliseconds);