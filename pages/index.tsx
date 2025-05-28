
import { useState } from "react";
import { supabase } from "../utils/supabase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timer, setTimer] = useState(180);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startFocusSession = () => {
    setSessionStarted(true);
    const id = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <main className="min-h-screen bg-gray-100 text-center p-8">
      <h1 className="text-4xl font-bold mb-4">Train Your Focus</h1>
      <p className="text-lg mb-8">Build deep concentration one day at a time.</p>

      {!sessionStarted ? (
        <>
          <button
            onClick={startFocusSession}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Start 3-Minute Focus Session
          </button>
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-2">Join the Waitlist</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border rounded w-64"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={async () => {
                if (!email) return;
                await supabase.from("waitlist").insert([{ email }]);
                alert("Thanks for signing up!");
                setEmail("");
              }}
              className="ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </>
      ) : (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Stay Focused</h2>
          <div className="text-5xl font-mono">{formatTime(timer)}</div>
          {timer === 0 && (
            <p className="mt-4 text-green-600 font-bold">Session Complete!</p>
          )}
        </div>
      )}
    </main>
  );
}
