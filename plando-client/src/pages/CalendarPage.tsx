import { useState, useEffect } from 'react';
import { getTaskItemsWithoutPaginationByUserId } from '../services/taskItemService';
import { YearView } from '../components/calendar/YearView';
import { MonthView } from '../components/calendar/MonthView';
import { WeekView } from '../components/calendar/WeekView';
import { DayView } from '../components/calendar/DayView';
import { CalendarView, TaskItem } from '../types';

export const CalendarPage = () => {

    const [calendarView, setCalendarView] = useState<CalendarView>(CalendarView.Month);
    const [selectedYear, setSelectedYear] = useState();
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedWeek, setSelectedWeek] = useState();
    const [selectedYDay, setSelectedDay] = useState();

    const bgColor = "bg-gray-50";

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const currentDateOfTheMonth = now.getUTCDate();
    const lastDateOfTheMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const tmpFirstWeekDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const firstWeekDayOfTheMonth = tmpFirstWeekDay === 0 ? 7 : tmpFirstWeekDay;
    const tmpCurrentDayOfTheWeek = now.getUTCDay();
    const currentDayOfTheWeek = tmpCurrentDayOfTheWeek === 0 ? 7 : tmpCurrentDayOfTheWeek;
    const firstDateOfTheWeek = now.getUTCDate() - (currentDayOfTheWeek - 1);
    const lastDateOfTheWeek = firstDateOfTheWeek + 6;

    const [taskItems, setTaskItems] = useState<TaskItem[] | null>(null);

    useEffect(() => {

        let dateFrom = new Date();
        let dateTo = new Date();

        switch (calendarView) {
            case CalendarView.Year:
                dateFrom = new Date(year, 0, 1, 0, 0, 0, 0);
                dateTo = new Date(year, 11, 31, 0, 0, 0, 0);
                break;
            case CalendarView.Month:
                dateFrom = new Date(year, month, 1, 0, 0, 0, 0);
                dateTo = new Date(year, month, lastDateOfTheMonth, 0, 0, 0, 0);
                break;
            case CalendarView.Week:
                dateFrom = new Date(year, month, firstDateOfTheWeek, 0, 0, 0, 0);
                dateTo = new Date(year, month, lastDateOfTheWeek, 0, 0, 0, 0);
                break;
            case CalendarView.Day:
                dateFrom = dateTo = now;
        }

        const fetchData = async () => {
            const allTaskItems = await getTaskItemsWithoutPaginationByUserId(dateFrom, dateTo);

            setTaskItems(allTaskItems);
        };
        fetchData();
    }, [calendarView]);

    const handlePreviousView = () => {

    };

    const handleNextView = () => {

    };

    return (
        <section className="p-2">

            <div
                className="grid-cols-1 grid-rows-3">

                <div className="flex grid-cols-1 md:grid-cols-6
                 gap-4 p-2 items-center justify-center">
                    <button
                        className={`${bgColor} p-1 border`}
                        key="previousViewButton"
                        onClick={e => handlePreviousView}>◀</button>

                    <button
                        className={`${calendarView === CalendarView.Year ? 'bg-blue-500 text-white' : bgColor}
                         p-1 border rounded`}
                        key="yearButton"
                        onClick={e => setCalendarView(CalendarView.Year)}>year</button>

                    <button
                        className={`${calendarView === CalendarView.Month ? 'bg-blue-500 text-white' : bgColor} 
                        p-1 border rounded`}
                        key="monthButton"
                        onClick={e => setCalendarView(CalendarView.Month)}>month</button>

                    <button
                        className={`${calendarView === CalendarView.Week ? 'bg-blue-500 text-white' : bgColor} 
                        p-1 border rounded`}
                        key="weekButton"
                        onClick={e => setCalendarView(CalendarView.Week)}>week</button>

                    <button
                        className={`${calendarView === CalendarView.Day ? 'bg-blue-500 text-white' : bgColor} 
                        p-1 border rounded`}
                        key="dayButton"
                        onClick={e => setCalendarView(CalendarView.Day)}>day</button>

                    <button
                        className={`${bgColor} p-1 border`}
                        key="nextViewButton"
                        onClick={e => handleNextView}>▶</button>
                </div>

                <div className="flex grid-cols-1 gap-4 p-2 justify-center">

                    <div className="border h-auto">
                        {calendarView === CalendarView.Year && <YearView />}
                        {calendarView === CalendarView.Month &&
                            <MonthView
                                year={year}
                                month={month}
                                currentDateOfTheMonth={currentDateOfTheMonth}
                                firstWeekDayOfTheMonth={firstWeekDayOfTheMonth}
                                lastDayOfTheMonth={lastDateOfTheMonth} />}
                        {calendarView === CalendarView.Week && <WeekView />}
                        {calendarView === CalendarView.Day && <DayView />}
                    </div>

                </div>

            </div>

        </section>
    );
};