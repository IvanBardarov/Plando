import { useState, useEffect, useMemo } from 'react';
import { getTaskItemsWithoutPaginationByUserId } from '../services/taskItemService';
import { YearView } from '../components/calendar/YearView';
import { MonthView } from '../components/calendar/MonthView';
import { WeekView } from '../components/calendar/WeekView';
import { DayView } from '../components/calendar/DayView';
import { CalendarView, TaskItem } from '../types';

export const CalendarPage = () => {

    const now = new Date();
    const [calendarView, setCalendarView] = useState<CalendarView>(CalendarView.Month);

    const [selectedWeek, setSelectedWeek] = useState(0);
    const [selectedDay, setSelectedDay] = useState(now.getDate());

    const bgColor = "bg-gray-50";


    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
    const currentDateOfTheMonth = now.getDate();

    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const lastDateOfPrevMonth = useMemo(() =>
        new Date(prevYear, prevMonth + 1, 0).getDate(),
        [selectedYear, selectedMonth]);

    const lastDateOfTheMonth = useMemo(() => 
        new Date(selectedYear, selectedMonth + 1, 0).getDate(),
        [selectedYear, selectedMonth]);

    const tmpFirstWeekDay = useMemo(() =>
        new Date(selectedYear, selectedMonth, 1).getDay(),
        [selectedYear, selectedMonth]);
    const firstWeekDayOfTheMonth = tmpFirstWeekDay === 0 ? 7 : tmpFirstWeekDay;
    const tmpCurrentDayOfTheWeek = now.getDay();
    const currentDayOfTheWeek = tmpCurrentDayOfTheWeek === 0 ? 7 : tmpCurrentDayOfTheWeek;
    const firstDateOfTheWeek = now.getDate() - (currentDayOfTheWeek - 1);
    const lastDateOfTheWeek = firstDateOfTheWeek + 6;

    const [taskItems, setTaskItems] = useState<TaskItem[] | null>(null);

    useEffect(() => {

        let dateFrom = new Date();
        let dateTo = new Date();

        switch (calendarView) {
            case CalendarView.Year:
                dateFrom = new Date(selectedYear, 0, 1, 0, 0, 0, 0);
                dateTo = new Date(selectedYear, 11, 31, 0, 0, 0, 0);
                break;
            case CalendarView.Month:
                dateFrom = new Date(selectedYear, selectedMonth, 1, 0, 0, 0, 0);
                dateTo = new Date(selectedYear, selectedMonth, lastDateOfTheMonth, 0, 0, 0, 0);
                break;
            case CalendarView.Week:
                dateFrom = new Date(selectedYear, selectedMonth, firstDateOfTheWeek, 0, 0, 0, 0);
                dateTo = new Date(selectedYear, selectedMonth, lastDateOfTheWeek, 0, 0, 0, 0);
                break;
            case CalendarView.Day:
                dateFrom = dateTo = now;
        }

        const fetchData = async () => {
            const allTaskItems = await getTaskItemsWithoutPaginationByUserId(dateFrom, dateTo);

            setTaskItems(allTaskItems);
        };
        fetchData();
    }, [calendarView, selectedYear, selectedMonth, selectedWeek, selectedDay]);

    const handlePreviousView = () => {
        switch (calendarView) {
            case CalendarView.Year:
                setSelectedYear(prev => prev - 1);
                break;
            case CalendarView.Month:
                if (selectedMonth === 0) {
                    setSelectedMonth(11);
                    setSelectedYear(prev => prev - 1);
                } else {
                    setSelectedMonth(prev => prev - 1);
                }
                break;
            case CalendarView.Day:
                if (selectedDay === 1) {
                    setSelectedMonth(prev => prev - 1)
                    setSelectedDay(lastDateOfPrevMonth);
                }
                else {
                    setSelectedDay(prev => prev - 1);
                }
                break;
        }
    };

    const handleNextView = () => {
        switch (calendarView) {
            case CalendarView.Year:
                setSelectedYear(next => next + 1);
                break;
            case CalendarView.Month:
                if (selectedMonth === 11) {
                    setSelectedMonth(0);
                    setSelectedYear(next => next + 1);
                } else {
                    setSelectedMonth(next => next + 1);
                }
                break;
            case CalendarView.Day:
                if (selectedDay === lastDateOfTheMonth) {
                    const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
                    const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
                    setSelectedYear(nextYear);
                    setSelectedMonth(nextMonth);
                    setSelectedDay(1);
                }
                else {
                    setSelectedDay(next => next + 1);
                }
                break;
        }
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
                        onClick={() => handlePreviousView()}>◀</button>

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
                        onClick={() => handleNextView()}>▶</button>
                </div>

                <div className="flex grid-cols-1 gap-4 p-2 justify-center">
                    <div className="h-auto">
                        {calendarView === CalendarView.Year &&
                            <YearView
                                currentMonth={currentMonth}
                                currentYear={currentYear}
                                year={selectedYear}
                                currentDateOfTheMonth={currentDateOfTheMonth}
                                vh={30}
                                calendarView={calendarView} />}
                        {calendarView === CalendarView.Month &&
                            <MonthView
                                currentMonth={currentMonth}
                                currentYear={currentYear}
                                year={selectedYear}
                                month={selectedMonth}
                                currentDateOfTheMonth={currentDateOfTheMonth}
                                firstWeekDayOfTheMonth={firstWeekDayOfTheMonth}
                                lastDayOfTheMonth={lastDateOfTheMonth}
                                vh={80}
                                calendarView={calendarView} />}
                        {calendarView === CalendarView.Week && <WeekView />}
                        {calendarView === CalendarView.Day &&
                            <DayView
                                date={new Date(selectedYear, selectedMonth, selectedDay)} />}
                    </div>

                </div>

            </div>

        </section>
    );
};