import { useState, useEffect } from 'react';
import { getTaskItemsUpToDateByUserId } from '../../services/taskItemService';
import { getTaskItemSchedulesByDate } from '../../services/taskItemScheduleService';
import { TaskItem, TaskItemSchedule } from '../../types';

export const DayView = (
    { date }: { date: Date }) => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    const hours = [
        "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
        "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
        "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
        "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
    ];

    const [taskItems, setTaskItems] = useState<TaskItem[] | null>(null);
    const [taskItemSchedules, setTaskItemSchedules] = useState<TaskItemSchedule[] | null>(null);

    useEffect(() => {
        const fetchedData = async () => {
            const yearStr = date.getFullYear();
            const monthStr = String(date.getMonth() + 1).padStart(2, '0');
            const dayStr = String(date.getDate()).padStart(2, '0');
            const dateStr = `${yearStr}-${monthStr}-${dayStr}`;
            const dateISO = new Date(dateStr);
            console.log(dateStr);
            const tasks = 
                await getTaskItemsUpToDateByUserId(dateISO, false);
            setTaskItems(tasks);
            console.log(tasks);
            const taskSchedules = await getTaskItemSchedulesByDate(dateISO);
            setTaskItemSchedules(taskSchedules);
        };
        fetchedData();
    }, [date]);

    return (
        <section className="p-2">

            <div className="font-bold">{y}-{m}-{d}</div>

            <div className="grid grid-cols md:grid-cols-2 gap-2">

                <div className="border">
                    {taskItems?.map(t => (
                        <div className="border bg-red-200 p-1 m-1"
                            key={t.id}>
                            {t.title} - {t.startDate != null ? new Date(t.startDate).toLocaleDateString()
                             : new Date(t.createdAt).toLocaleDateString()}
                        </div>
                    ))}
                </div>

                <div className="border">
                    {hours.map(h => (
                        <div className="border"
                            key={h}>
                            {h}
                        </div>
                    ))}
                </div>

            </div>

        </section>
    );
};