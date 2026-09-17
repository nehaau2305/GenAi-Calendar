"use client"

import {Note} from "../lib/api";
import styles from "./NotesModal.module.css";

interface NotesModalProps {
    date: string;
    notes: Note[];
    onClose: () => void;
}

export default function NotesModal({date, notes, onClose}: NotesModalProps) {
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.heading}>Notes from this day</h2>
                    <button onClick={onClose} className={styles.closeButton}>✖</button>
                </div>

                {notes.length === 0 ? (
                    <p className={styles.emptyMessage}>No notes from this day.</p>
                ) : (
                    <div className={styles.notesList}>
                        {notes.map((note) => (
                            <div key={note.id} className={styles.noteCard}>
                                {note.content}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}