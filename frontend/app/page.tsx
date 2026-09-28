"use client";

import { useEffect, useState } from "react";
import {Event, Note, Suggestion, getEvents, getNotes, getSuggestions, generateSuggestions} from "../src/lib/api";
import SuggestionsModal from "../src/components/SuggestionsModal";
import CalendarView from "../src/components/CalendarView";
import styles from "./page.module.css";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [suggestionsModalOpen, setSuggestionsModalOpen] = useState(false);

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

  useEffect(() => {
    setSuggestionsModalOpen(suggestions.length > 0);
  }, [suggestions.length]);

  const handleNoteCreated = async (noteId: number) => {
    await generateSuggestions(noteId);
    await refreshData();
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>GenAi Calendar</h1>
      <CalendarView events={events} notes={notes} onNoteCreated={handleNoteCreated} />
      {suggestionsModalOpen && (
        <SuggestionsModal
          suggestions={suggestions}
          onSuggestionHandled={refreshData}
          onClose={() => setSuggestionsModalOpen(false)}
        />
      )}
    </main>
  );
}