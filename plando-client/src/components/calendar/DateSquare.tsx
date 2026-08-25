import { CalendarView } from '../../types';

export const DateSquare = (
    { currentYear, currentMonth,
        selectedMonth, selectedYear,
        currentDateOfTheMonth, dayOfTheMonth,
    calendarView }:
        {
            currentYear: number; currentMonth: number;
            selectedMonth: number, selectedYear: number;
            currentDateOfTheMonth: number; dayOfTheMonth: number,
            calendarView: CalendarView
        }) => {

    const isCurrentDate =
        currentDateOfTheMonth === dayOfTheMonth &&
        currentMonth === selectedMonth &&
        currentYear === selectedYear;

    const textSize = calendarView === CalendarView.Year ? 'text-[0.6vw]' : 'text-[0.9vw]';

    const bgColorTextColor =
        isCurrentDate ? "bg-blue-500 text-white" : "bg-gray-50";

    return (
        <div className={`${bgColorTextColor} border rounded w-auto h-auto
         aspect-square flex items-center justify-center ${textSize}`}>
            {dayOfTheMonth}
        </div>
    );
};