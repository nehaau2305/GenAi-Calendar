"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Loading...");
  
  useEffect(() => {
    fetch("http://localhost:8000/")
    .then((res) => res.json())
    .then((data) => setMessage(data.message))
    .catch(() => setMessage("Could not connect to backend"));
  }, []);

  return (
    <main>
      <h1>GenAi Calendar</h1>
      <p>{message}</p>
    </main>
  );
}