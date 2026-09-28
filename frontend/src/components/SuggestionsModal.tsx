"use client";

import { Suggestion, acceptSuggestion, dismissSuggestion } from "../lib/api";
import styles from "./SuggestionsModal.module.css";

interface SuggestionsModalProps {
    suggestions: Suggestion[];
    onSuggestionHandled: () => void;
    onClose: () => void;
}

export default function SuggestionsModal({suggestions, onSuggestionHandled, onClose}: SuggestionsModalProps) {
    const handleAccept = async (id: number) => {
        try {
            await acceptSuggestion(id);
            onSuggestionHandled();
        } catch (error) {
            console.error("Suggestions Modal accept suggestions failed: ", error);
        }
    };

    const handleDismiss = async (id:number) => {
        try  {
            await dismissSuggestion(id);
            onSuggestionHandled();
        } catch (error) {
            console.error("Suggestions Modal dismiss suggestions failed: ", error);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>

                <div className={styles.modalHeader}>
                    <h2 className={styles.heading}>AI Suggestions</h2>
                    <button onClick={onClose} className={styles.closeButton}>✖</button>
                </div>

                <div className={styles.suggestionsList}>
                    {suggestions.map((suggestion) => (
                        <div key={suggestion.id} className={styles.card}>
                            <div className={styles.suggTitle}>{suggestion.title}</div>

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
                                <button onClick={() => handleAccept(suggestion.id)} className={styles.acceptButton}>Accept</button>
                                <button onClick={() => handleDismiss(suggestion.id)} className={styles.dismissButton}>Dismiss</button>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}