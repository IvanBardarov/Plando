export const DateSquare = ({ currentDateOfTheMonth, dayOfTheMonth }:
    { currentDateOfTheMonth: number; dayOfTheMonth: number }) => {

    const bgColorTextColor =
        currentDateOfTheMonth === dayOfTheMonth ? "bg-blue-500 text-white" : "bg-gray-50";

    return (
        <div className={`${bgColorTextColor} border rounded w-full h-full
         aspect-square flex items-center justify-center`}>
            {dayOfTheMonth}
        </div>
    );
};