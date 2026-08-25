"use client";

import {useState} from "react";
import {createNote} from "../lib/api";
import styles from "./NoteForm.module.css";
import { create } from "domain";

interface NoteFormProps {
    onNoteCreated: (noteId: number) => void;
}

export default function NoteForm({onNoteCreated}: NoteFormProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!content.trim()) return;
        setIsSubmitting(true);

        try {
            const newNote = await createNote(content);
            setContent("");
            onNoteCreated(newNote.id);
        } catch (error) {
            console.log("Note creation failed: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.heading}>Daily Notes</h2>
            <textarea
                placeholder="Notes"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className={styles.textArea}
            />
            <button type="submit" disabled={isSubmitting} className={styles.button}>
                {isSubmitting ? "Saving" : "Save Note"}
            </button>
        </form>
    );
}