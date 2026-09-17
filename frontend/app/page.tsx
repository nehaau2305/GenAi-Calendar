"use client";

import { useEffect, useState } from "react";
import {Event, Note, Suggestion, getEvents, getNotes, getSuggestions, generateSuggestions} from "../src/lib/api";
import NoteForm from "../src/components/NoteForm";
import SuggestionsList from "../src/components/SuggestionsList";
import CalendarView from "../src/components/CalendarView";
import Sidebar from "../src/components/Sidebar";
import styles from "./page.module.css";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  const refreshData = async () => {
    const [eventsData, notesData, suggestionsData] = await Promise.all([
      getEvents(),
      getNotes(),
      getSuggestions(),
    ]);
    setEvents(eventsData);
    setNotes(notesData);
    setSuggestions(suggestionsData);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleNoteCreated = async (noteId: number) => {
    await generateSuggestions(noteId);
    await refreshData();
  };

  return (
    <main className={styles.main}>
      <div className={styles.theHeader}>
        <h1 className={styles.heading}>GenAi Calendar</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={styles.toggleButton}
        >{sidebarOpen ? "→" : "←"}</button>
      </div>
      

      <div className={styles.layoutRow}>
        <div className={sidebarOpen ? styles.calendarColumnShrunk : styles.calendarColumn}>
          <CalendarView events={events} notes={notes}/>
        </div>
        {sidebarOpen && (
          <div className={styles.sidebarColumn}>
            <Sidebar onNoteCreated={handleNoteCreated} />
          </div>
        )}
      </div>
      <SuggestionsList suggestions={suggestions} onSuggestionHandled={refreshData} />
    </main>
  );
}