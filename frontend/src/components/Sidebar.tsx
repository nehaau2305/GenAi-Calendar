"use client";

import NoteForm from "./NoteForm";
import styles from "./Sidebar.module.css";

interface SidebarProps {
    onNoteCreated: (noteId: number) => void;
}

export default function Sidebar({onNoteCreated}: SidebarProps) {
    return (
        <div className={styles.sidebar}>
            <NoteForm onNoteCreated={onNoteCreated} />
            {/** include more sections here later */}
        </div>
    );
}