"use client"

import { useState } from "react";
import { Event } from "../lib/api";
import styles from "./CalendarView.module.css"

interface CalendarViewProps {
    events: Event[];
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function CalendarView({events}: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingWeekday = firstDayOfMonth.getDay();

    const gridCells: (number | null)[] = [];
    // null for padding of days not in month
    for (let i = 0; i < startingWeekday; i++) {
        gridCells.push(null);
    }
    // actual days
    for (let day = 1; day <= daysInMonth; day++) {
        gridCells.push(day);
    }

    const eventsByDate: Record<string, Event[]> = {};
    for (const event of events) {
        // split at time
        const dateKey = event.start_time.split("T")[0];
        if (!eventsByDate[dateKey]) {
            eventsByDate[dateKey] = [];
        }
        eventsByDate[dateKey].push(event);
    }

    const today = new Date();
    const isToday = (day: number) =>
        day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };
    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={goToPreviousMonth} className={styles.navButton}>Previous</button>
                <div className={styles.monthLabel}>{MONTH_LABELS[month]}{year}</div>
                <button onClick={goToNextMonth} className={styles.navButton}>Next</button>
            </div>

            <div className={styles.weekdayRow}>
                {WEEKDAY_LABELS.map((label) => (
                    <div key={label}>{label}</div>
                ))}
            </div>

            <div className={styles.grid}>
                {gridCells.map((day, index) => {
                    if (day === null) {
                        return <div key={`empty-${index}`} className={`${styles.dayCell} ${styles.emptyCell}`} />;
                    }

                    const dateKey = `${year}-${String(month+1).padStart(2, "0")}-${String(day).padStart(2,"0")}`;
                    const dayEvents = eventsByDate[dateKey] || [];

                    return (
                        <div
                            key={dateKey}
                            className={`${styles.dayCell} ${isToday(day) ? styles.todayCell : ""}`}
                        >
                            <div className={styles.dayNumber}>{day}</div>
                            {dayEvents.map((event) => (
                                <div key={event.id} className={styles.eventBox} title={event.title}>
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}