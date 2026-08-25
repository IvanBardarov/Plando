import { useState, useEffect } from 'react';
import { DateSquare } from './DateSquare';

export const MonthView = (
    { currentYear, currentMonth, year, month, currentDateOfTheMonth,
        firstWeekDayOfTheMonth, lastDayOfTheMonth }:
        {
            currentYear: number; currentMonth: number;
            year: number; month: number; currentDateOfTheMonth: number;
            firstWeekDayOfTheMonth: number; lastDayOfTheMonth: number
        }) => {

    const [vh, setVh] = useState(80);

    useEffect(() => {
        const updateSize = () => {
            if (window.innerWidth < 480)
                setVh(95);
            else if (window.innerWidth < 768)
                setVh(90);
            else if (window.innerWidth < 1024)
                setVh(85);
            else if (window.innerWidth < 1280)
                setVh(80);
            else if (window.innerWidth < 1536)
                setVh(75);
            else
                setVh(70);
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const monthName = new Date(Date.UTC(year, month)).toLocaleString("en-US", { month: "long" });

    return (
        <section className="p-2 flex flex-col items-center mx-auto 
        overflow-x-auto overflow-y-auto"
            style={{ height: `${vh}vh`, width: `${vh}vh` }}>

            <div className="text-center font-bold">{monthName} {year}</div>

            <div className="flex-1 grid grid-cols-7 gap-2">

                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                    <div key={day} className="text-center font-bold">{day}</div>
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
                        dayOfTheMonth={i + 1} />
                ))}

            </div>

        </section>
    );
};