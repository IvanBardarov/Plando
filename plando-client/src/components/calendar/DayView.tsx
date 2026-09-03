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

            <div className="font-bold text-center">{y}-{m}-{d}</div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2" style={{ height: '85vh' }}>

                <div className="border col-span-1 overflow-y-scroll">
                    {taskItems?.map(t => (
                        <div className="border bg-red-200 p-1 m-1"
                            key={t.id}>
                            {t.title} - {t.startDate != null ? new Date(t.startDate).toLocaleDateString()
                                : new Date(t.createdAt).toLocaleDateString()}
                        </div>
                    ))}
                </div>

                <div className="border col-span-3 overflow-y-scroll"
                    style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '48px',
                        width: '1px',
                        height: '1440px',
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