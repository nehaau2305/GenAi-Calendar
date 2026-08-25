"use client"

import {useState} from "react";
import {createEvent} from "../lib/api";
import styles from "./EventForm.module.css";

// refresh event list after new event created
interface EventFormProps {
    onEventCreated: () => void;
}

export default function EventForm({onEventCreated}: EventFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");
    // if submission in progress, disable buttons
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createEvent({
                title,
                description: description || null,
                start_time: `${date}T${startTime}:00`,
                end_time: `${date}T${endTime}:00`,
                location: location || null,
            });
            // clear form
            setTitle("");
            setDescription("");
            setDate("");
            setStartTime("");
            setEndTime("");
            setLocation("");
            // notify parent component
            onEventCreated();
        } catch (error) {
            console.error("Failed to create event in EventForm.tsx: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.heading}>Add Event</h2>
            <input
                type="text"
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={styles.input}
            />
            <textarea
                placeholder = "Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.input}
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={styles.input}
            />
            <div className={styles.timeRow}>
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className={styles.timeInput}
                />
                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className={styles.timeInput}
                />
            </div>
            <input
                type="text"
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className={styles.input}
            />
            <button type="submit" disabled={loading} className={styles.button}>
                {loading ? "Loading..." : "Create Event"}
            </button>
        </form>
    );

}