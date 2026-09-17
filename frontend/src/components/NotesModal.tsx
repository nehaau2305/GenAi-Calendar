"use client"

import { useState } from "react";
import {Note, createNote} from "../lib/api";
import styles from "./NotesModal.module.css";

interface NotesModalProps {
    date: string;
    notes: Note[];
    isToday: boolean;
    onNoteCreated: (noteId: number) => void;
    onClose: () => void;
}

export default function NotesModal({date, notes, isToday, onNoteCreated, onClose}: NotesModalProps) {
    const [isWriting, setIsWriting] = useState(false);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSaveNote = async () => {
        if (!content.trim()) return;
        setIsSubmitting(true);

        try {
            const newNote = await createNote(content);
            setContent("");
            setIsWriting(false);
            onNoteCreated(newNote.id);
        } catch (error) {
            console.error("NoteModal: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.heading}>Notes from this day</h2>
                    <div className={styles.headerButtons}>
                        {isToday && !isWriting && (
                            <button onClick={() => setIsWriting(true)} className={styles.newNoteButton}>
                                New Note
                            </button>
                        )}
                        <button onClick={onClose} className={styles.closeButton}>✖</button>
                    </div>
                </div> {/** modal header */}

                {isWriting && (
                    <div className={styles.newNoteForm}>
                        <textarea
                            placeholder="Enter text here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            className={styles.textArea}
                        />
                        <button
                            onClick={handleSaveNote}
                            disabled={isSubmitting}
                            className={styles.saveButton}
                        >
                            {isSubmitting ? "Saving..." : "Save Note"}
                        </button>
                    </div>
                )}
                

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