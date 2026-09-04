import { useState, useEffect } from 'react';
import { getTaskItemsUpToDateByUserId } from '../../services/taskItemService';
import { getTaskItemSchedulesByDate } from '../../services/taskItemScheduleService';
import { TaskItem, TaskItemSchedule } from '../../types';

export const DayView = (
    { date }: { date: Date }) => {

    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    const hours = Array.from({ length: 25 }, (_, i) => i);

    const [activeTaskItems, setActiveTaskItems] = useState<TaskItem[] | null>(null);
    const [overdueTaskItems, setOverdueTaskItems] = useState<TaskItem[] | null>(null);
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

            const activeTasks = tasks?.filter(t => new Date(t.dueDate) >= date) ?? null;
            setActiveTaskItems(activeTasks);

            const overdueTasks = tasks?.filter(t => new Date(t.dueDate) < date) ?? null;
            setOverdueTaskItems(overdueTasks);

            console.log(tasks);

            const taskSchedules = await getTaskItemSchedulesByDate(dateISO);
            setTaskItemSchedules(taskSchedules);
        };
        fetchedData();
    }, [date]);

    const bgAndTextColor = (isImportant: boolean, isUrgent: boolean) => {

        const importantUrgent = "bg-red-400 text-red-900";
        const importantNotUrgent = "bg-orange-300 text-orange-800";
        const notImportantUrgent = "bg-blue-200 text-blue-600";
        const notImportantNotUrgent = "bg-gray-100 text-gray-600";

        if (isImportant && isUrgent)
            return importantUrgent;

        if (isImportant && !isUrgent)
            return importantNotUrgent;

        if (!isImportant && isUrgent)
            return notImportantUrgent;

        if (!isImportant && !isUrgent)
            return notImportantNotUrgent;
    };

    const titleAttr = (isImportant: boolean, isUrgent: boolean) => {

        const importantUrgent = "Important + Urgent";
        const importantNotUrgent = "Important + Not Urgent";
        const notImportantUrgent = "Not Important + Urgent";
        const notImportantNotUrgent = "Not Important + Not Urgent";

        if (isImportant && isUrgent)
            return importantUrgent;

        if (isImportant && !isUrgent)
            return importantNotUrgent;

        if (!isImportant && isUrgent)
            return notImportantUrgent;

        if (!isImportant && !isUrgent)
            return notImportantNotUrgent;
    };

    return (
        <section className="p-2">

            <div className="font-bold text-center">{y}-{m}-{d}</div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2"
                style={{ height: '85vh' }}>

                <div className="col-span-1 flex flex-col h-full">

                    <div className="border h-[42.5vh] overflow-hidden">
                        <div className="ml-1 mt-2">
                            <span
                                className="m-1 p-1 bg-gray-600 text-white rounded-full">
                                Active Tasks
                            </span>
                        </div>
                        <div className="h-[40vh] overflow-y-scroll">
                            {activeTaskItems?.map(t => (
                                <div
                                    className={`${bgAndTextColor(t.isImportant, t.isUrgent)} border-2 border-gray-400 rounded-full p-2 m-1`}
                                    key={t.id}
                                    title={titleAttr(t.isImportant, t.isUrgent)}>
                                    {t.title} - {t.startDate != null
                                        ? new Date(t.startDate).toLocaleDateString()
                                        : new Date(t.createdAt).toLocaleDateString()}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-1 border h-[42.5vh] overflow-hidden">
                        <div className="ml-1 mt-2">
                            <span
                                className="m-1 p-1 bg-red-600 text-white rounded-full">
                                Overdue Tasks
                            </span>
                        </div>
                        <div className="h-[40vh] overflow-y-scroll">
                            {overdueTaskItems?.map(t => (
                                <div
                                    className={`${bgAndTextColor(t.isImportant, t.isUrgent)} border-2 border-red-400 rounded-full p-2 m-1`}
                                    key={t.id}
                                    title={titleAttr(t.isImportant, t.isUrgent)}>
                                    {t.title} - {t.startDate != null
                                        ? new Date(t.startDate).toLocaleDateString()
                                        : new Date(t.createdAt).toLocaleDateString()}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="border col-span-3 overflow-y-scroll"
                    style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '48px',
                        width: '1px',
                        height: '1460px',
                        backgroundColor: '#dadce0'
                    }} />
                    {hours.map(h => (
                        <div key={h}
                            style={{
                                position: 'absolute',
                                top: `${60 * h}px`,
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                            <span style={{
                                width: '40px', fontSize: '11px', color: '#70757a',
                                textAlign: 'right', paddingRight: '8px'
                            }}>
                                {h < 10 ? `0${h}:00` : `${h}:00`}
                            </span>
                            <div style={{
                                flex: 1,
                                borderTop: '1px solid #e5e7eb',
                                borderLeft: '2px solid #e5e6eb'
                            }} />
                        </div>
                    ))}
                </div>

            </div>

        </section>
    );
};