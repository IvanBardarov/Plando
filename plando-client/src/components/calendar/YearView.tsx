import { MonthView } from './MonthView';
import { CalendarView } from '../../types';

export const YearView = (
    { currentYear, currentMonth, year, currentDateOfTheMonth, vh, calendarView }:
        {
            currentYear: number; currentMonth: number; year: number;
            currentDateOfTheMonth: number; vh: number; calendarView: CalendarView;
        }) => {
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const firstWeekDayOfTheMonth = (month: number) => {
        const tmp = new Date(Date.UTC(year, month, 1)).getUTCDay();
        return tmp === 0 ? 7 : tmp;
    };
    const lastDateOfTheMonth = (month: number) => {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    };

    return (
        <section className="p-2 flex flex-col items-center mx-auto 
        overflow-x-auto overflow-y-auto">

            <div className="grid grid-cols-1 md:grid-cols-6">
                {months.map(month =>
                    <div
                        key={`${year}-${month}`}>
                        <MonthView
                            currentMonth={currentMonth}
                            currentYear={currentYear}
                            year={year}
                            month={month}
                            currentDateOfTheMonth={currentDateOfTheMonth}
                            firstWeekDayOfTheMonth={firstWeekDayOfTheMonth(month)}
                            lastDayOfTheMonth={lastDateOfTheMonth(month)}
                            vh={vh}
                            calendarView={calendarView} />
                    </div>)}
            </div>

        </section>
    );
};