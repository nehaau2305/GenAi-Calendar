"use client"

import {useState} from "react";
import {createEvent} from "../lib/api";
import styles from "./EventModal.module.css";

// refresh event list after new event created
interface EventModalProps {
    date: string;
    onClose: () => void;
    onEventCreated: () => void;
}

export default function EventModal({date, onClose, onEventCreated}: EventModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
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
            onEventCreated();
            onClose();
        } catch (error) {
            console.error("Failed to create event in EventModal.tsx: ", error);
        } finally {
            setLoading(false);
        }
    };

    // clicking off the modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.heading}>Add Event</h2>
                    <button onClick={onClose} className={styles.closeButton}>✖</button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
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
                        className={styles.input}
                    />
                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? "Loading..." : "Create Event"}
                    </button>
                </form>
            </div>
        </div>
    );
}