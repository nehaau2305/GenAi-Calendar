"use client";

import { useEffect, useState } from "react";
import {Event, Suggestion, getEvents, getSuggestions, generateSuggestions} from "../src/lib/api";
import EventForm from "../src/components/EventForm";
import NoteForm from "../src/components/NoteForm";
import SuggestionsList from "../src/components/SuggestionsList";
import CalendarView from "../src/components/CalendarView";
import styles from "./page.module.css";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const refreshData = async () => {
    const [eventsData, suggestionsData] = await Promise.all([
      getEvents(),
      getSuggestions(),
    ]);
    setEvents(eventsData);
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
      <h1 className={styles.heading}>GenAi Calendar</h1>
      <CalendarView events={events} />

      <div className={styles.formsRow}>
        <div className={styles.formColumn}>
          <EventForm onEventCreated={refreshData} />
        </div>
        <div className={styles.formColumn}>
          <NoteForm onNoteCreated={handleNoteCreated} />
        </div>
      </div>

      <SuggestionsList suggestions={suggestions} onSuggestionHandled={refreshData} />
    </main>
  );
}