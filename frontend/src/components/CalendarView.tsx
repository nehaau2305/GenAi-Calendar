"use client"

import { useState } from "react";
import { Event, Note } from "../lib/api";
import styles from "./CalendarView.module.css";
import EventModal from "./EventModal";
import NotesModal from "./NotesModal";

interface CalendarViewProps {
    events: Event[];
    notes: Note[];
    onNoteCreated: (noteId: number) => void;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function CalendarView({events, notes, onNoteCreated}: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [notesModalDate, setNotesModalDate] = useState<string | null>(null);

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

    const notesByDate: Record<string, Note[]> = {};
    for (const note of notes) {
        const dateKey = note.created_at.split("T")[0];
        if (!notesByDate[dateKey]) {
            notesByDate[dateKey] = [];
        }
        notesByDate[dateKey].push(note);
    }

    const today = new Date();
    const todayDateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const isToday = (dateKey: string) => dateKey === todayDateKey;

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };
    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };
    const openEventModal = (dateKey: string) => {
        setSelectedDate(dateKey);
    };
    const closeEventModal = () => {
        setSelectedDate(null);
    };
    const openNotesModal = (dateKey: string) => {
        setNotesModalDate(dateKey);
    };
    const closeNotesModal = () => {
        setNotesModalDate(null);
    };

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
                            className={`${styles.dayCell} ${isToday(dateKey) ? styles.todayCell : ""}`}
                        >
                            <div className={styles.dayCellHeader}>
                                <div className={styles.dayNumber}>{day}</div>
                                <div className={styles.dayActions}>
                                    <button
                                        type="button"
                                        className={styles.openNotesButton}
                                        onClick={() => openNotesModal(dateKey)}
                                        aria-label="View Notes"
                                    >
                                        <img
                                            src="/images/note-icon.png"
                                            alt=""
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.addEventButton}
                                        onClick={() => openEventModal(dateKey)}
                                        aria-label={`Add Event`}
                                    >+</button>
                                </div>
                            </div>
                            {dayEvents.map((event) => (
                                <div key={event.id} className={styles.eventBox} title={event.title}>
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
            {selectedDate && (
                <EventModal
                    date={selectedDate}
                    onClose={closeEventModal}
                    onEventCreated={() => {}}
                />
            )}
            {notesModalDate && (
                <NotesModal
                    date={notesModalDate}
                    notes={notesByDate[notesModalDate] || []}
                    isToday={notesModalDate ? isToday(notesModalDate) : false}
                    onNoteCreated={onNoteCreated}
                    onClose={closeNotesModal}
                />
            )}
        </div>
    );
}