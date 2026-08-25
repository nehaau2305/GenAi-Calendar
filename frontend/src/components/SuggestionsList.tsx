"use client";

import {Suggestion, acceptSuggestion, dismissSuggestion} from "../lib/api";
import styles from "./SuggestionsList.module.css";

interface SuggestionsListProps {
    suggestions: Suggestion[];
    // to refresh data after accept/dismiss
    onSuggestionHandled: () => void; 
}

export default function SuggestionsList({suggestions, onSuggestionHandled}: SuggestionsListProps) {
    const handleAccept = async (id: number) => {
        try {
            await acceptSuggestion(id);
            onSuggestionHandled();
        } catch (error) {
            console.error("Failed to accept suggestion: ", error);
        }
    };

    const handleDismiss = async (id: number) => {
        try {
            await dismissSuggestion(id);
            onSuggestionHandled();
        } catch (error) {
            console.error("Failed to dismiss suggestion: ", error);
        }
    };

    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>AI Suggestions</h2>

            {suggestions.map((suggestion) => (
                <div key={suggestion.id} className={styles.card}>
                    <div className={styles.title}>{suggestion.title}</div>

                    {suggestion.description && (
                        <div className={styles.description}>{suggestion.description}</div>
                    )}
                    {suggestion.suggested_start_time && (
                        <div className={styles.time}>
                            {new Date(suggestion.suggested_start_time).toLocaleString()}
                        </div>
                    )}
                    {suggestion.location && (
                        <div className={styles.location}>{suggestion.location}</div>
                    )}

                    <div className={styles.actions}>
                        <button
                            onClick={() => handleAccept(suggestion.id)} 
                            className={styles.acceptButton}
                        >Accept</button>
                        <button
                            onClick={() => handleDismiss(suggestion.id)}
                            className={styles.dismissButton}
                        >Dismiss</button>
                    </div>
                </div>
            ))}
        </div>
    );
}