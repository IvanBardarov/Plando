export const DateSquare = (
    { currentYear, currentMonth,
        selectedMonth, selectedYear,
        currentDateOfTheMonth, dayOfTheMonth }:
        {
            currentYear: number; currentMonth: number;
            selectedMonth: number, selectedYear: number;
            currentDateOfTheMonth: number; dayOfTheMonth: number
        }) => {

    const isCurrentDate =
        currentDateOfTheMonth === dayOfTheMonth &&
        currentMonth === selectedMonth &&
        currentYear === selectedYear;

    const bgColorTextColor =
        isCurrentDate ? "bg-blue-500 text-white" : "bg-gray-50";

    return (
        <div className={`${bgColorTextColor} border rounded w-full h-full
         aspect-square flex items-center justify-center`}>
            {dayOfTheMonth}
        </div>
    );
};