import { DateSquare } from './DateSquare';
import { CalendarView } from '../../types';

export const MonthView = (
    { currentYear, currentMonth, year, month, currentDateOfTheMonth,
        firstWeekDayOfTheMonth, lastDayOfTheMonth, vh = 80, calendarView }:
        {
            currentYear: number; currentMonth: number;
            year: number; month: number; currentDateOfTheMonth: number;
            firstWeekDayOfTheMonth: number; lastDayOfTheMonth: number;
            vh: number; calendarView: CalendarView;
        }) => {

    const monthName = new Date(year, month).toLocaleString("en-US", { month: "long" });
    const textSize = calendarView === CalendarView.Year ? 'text-[0.6vw]' : 'text-[0.9vw]';

    return (
        <section className="m-2 p-2 border flex flex-col items-center mx-auto"
            style={{ height: `${vh}vh`, width: `${vh}vh` }}>

            <div className={`text-center font-bold ${textSize}`}>
                {monthName} {year}
            </div>

            <div className="flex-1 grid grid-cols-7 gap-2">

                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                    <div key={day} className={`text-center font-bold ${textSize}`}>{day}</div>
                ))}

                {Array.from({ length: firstWeekDayOfTheMonth - 1 }, (_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: lastDayOfTheMonth }, (_, i) => (
                    <DateSquare key={i + 1}
                        currentYear={currentYear}
                        currentMonth={currentMonth}
                        selectedMonth={month}
                        selectedYear={year}
                        currentDateOfTheMonth={currentDateOfTheMonth}
                        dayOfTheMonth={i + 1}
                        calendarView={calendarView} />
                ))}

            </div>

        </section>
    );
};