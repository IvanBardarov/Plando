import { useState, useEffect } from 'react';
import { getTaskItemsWithoutPaginationByUserId } from '../../services/taskItemService';
import { getTaskItemSchedulesByDate } from '../../services/taskItemScheduleService';
import { TaskItem, TaskItemSchedule } from '../../types';

export const DayView = ({date}: {date: Date}) => {

    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();

    const hours = [
        "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", 
        "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", 
        "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", 
        "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", 
    ]

    const [taskItems, setTaskItems] = useState<TaskItem[] | null>(null);
    const [taskItemSchedules, setTaskItemSchedules] = useState<TaskItemSchedule[] | null>(null);

    useEffect(() => {
        const fetchedData = async () => {
            const tasks = await getTaskItemsWithoutPaginationByUserId(date, date);
            setTaskItems(tasks);
            const taskSchedules = await getTaskItemSchedulesByDate(date);
            setTaskItemSchedules(taskSchedules);
        };
        fetchedData();
    }, []);

    return (
        <section className="p-2">

            <div className="font-bold">{y}-{m}-{d}</div>

            <div className="grid grid-cols md:grid-cols-2 gap-2">

                <div className="border">
                    {taskItems?.map(t => (
                        <div className="border bg-red-200 p-1 m-1">
                            {t.title}
                        </div>
                    ))}
                </div>

                <div className="border">
                    {hours.map(h => (
                        <div className="border">
                            {h}
                        </div>
                    ))}
                </div>

            </div>

        </section>
    );
};