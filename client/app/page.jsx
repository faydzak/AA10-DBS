"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

const fmt = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });


export default function Home() {
  const [todos, setTodos]     = useState([]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding]   = useState(false);
  const [deletingId, setDel]  = useState(null);
  const [error, setError]     = useState(null);
  const inputRef              = useRef(null);

  const fetchTodos = async () => {
    try {
      const { data } = await api.get("/api/todos");
      setTodos(data);
    } catch {
      setError("Could not load tasks. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchTodos(); }, []);

  const handleAdd = async () => {
    const task = input.trim();
    if (!task) return;
    setAdding(true);
    setError(null);
    try {
      const { data } = await api.post("/api/todos", { task });
      setTodos((prev) => [data, ...prev]);
      setInput("");
      inputRef.current?.focus();
    } catch {
      setError("Failed to add task. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    setDel(id);
    setError(null);
    try {
      await api.delete(`/api/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch {
      setError("Failed to delete task.");
    } finally {
      setDel(null);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleAdd(); };

  return (
    <main className="min-h-screen px-4 py-16 md:py-24"
      style={{ background: "linear-gradient(160deg, #e8f4fd 0%, #ffffff 60%, #daeef9 100%)" }}>

      {/* ── Header ── */}
      <header className="max-w-xl mx-auto mb-12">
        <div className="flex items-end justify-between gap-4">

          {/* Title */}
          <div className="pb-2">
            <p className="text-xs tracking-[0.3em] uppercase text-[#7ab8d4] mb-2 font-sans">
              Personal workspace
            </p>
            <h1 className="text-5xl md:text-6xl font-bold leading-none tracking-tight text-[#1a3f52]">
              Things<br />
              <span className="text-[#3a9dc4]">to do.</span>
            </h1>
          </div>

          {/* Mascot */}
          <div className="flex-shrink-0 w-32 md:w-40 drop-shadow-sm">
            <Image
              src="/Phainon.webp"
              alt="Mascot"
              width={160}
              height={160}
              className="w-full h-auto"
              priority
            />
          </div>

        </div>
        <div className="mt-6 h-px bg-gradient-to-r from-[#3a9dc4] via-[#a8d8ee] to-transparent" />
      </header>

      <div className="max-w-xl mx-auto space-y-8">

        {/* ── Input card ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-[#d0eaf5] p-5">
          <div className="flex gap-3 items-stretch">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="What needs to be done?"
              disabled={adding}
              className="
                flex-1 bg-[#f0f8fd] border border-[#c2dff0] rounded-xl
                px-4 py-3 text-[#1a3f52] placeholder-[#9ac5dc]
                font-sans text-sm
                focus:outline-none focus:border-[#3a9dc4] focus:ring-2 focus:ring-[#3a9dc4]/20
                transition-all duration-200
                disabled:opacity-50
              "
            />
            <button
              onClick={handleAdd}
              disabled={adding || input.trim() === ""}
              className="
                px-6 py-3 bg-[#3a9dc4] text-white
                font-sans text-xs font-bold tracking-[0.15em] uppercase rounded-xl
                hover:bg-[#2e88ad] active:scale-95
                transition-all duration-150 shadow-sm
                disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
              "
            >
              {adding ? "…" : "Add"}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-xs font-sans text-red-400 tracking-wide">
              ⚠ {error}
            </p>
          )}
        </section>

        {/* ── List card ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-[#d0eaf5] overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 bg-[#edf6fb] animate-pulse rounded-xl"
                  style={{ opacity: 1 - i * 0.25 }}
                />
              ))}
            </div>
          ) : todos.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl mb-3" style={{ opacity: 0.25 }}>◎</p>
              <p className="font-sans text-sm text-[#9ac5dc] tracking-widest uppercase">
                All clear
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#eaf4fb]">
              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className="group flex items-start justify-between gap-4 px-5 py-4 hover:bg-[#f5fbfe] transition-colors duration-150"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="mt-[7px] flex-shrink-0 w-2 h-2 rounded-full bg-[#a8d8ee]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1a3f52] text-sm leading-snug break-words">
                        {todo.task}
                      </p>
                      <p className="mt-0.5 text-[10px] font-sans tracking-widest uppercase text-[#aacfe3]">
                        {fmt(todo.created_at)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(todo._id)}
                    disabled={deletingId === todo._id}
                    aria-label="Delete task"
                    className="
                      flex-shrink-0 mt-0.5 w-7 h-7 flex items-center justify-center rounded-full
                      text-[#b8d9eb] hover:text-red-400 hover:bg-red-50
                      font-sans text-lg leading-none
                      opacity-0 group-hover:opacity-100
                      transition-all duration-150
                      disabled:opacity-30
                    "
                  >
                    {deletingId === todo._id
                      ? <span className="text-xs animate-spin inline-block">◌</span>
                      : "×"}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!loading && todos.length > 0 && (
            <div className="px-5 py-3 bg-[#f5fbfe] border-t border-[#eaf4fb]">
              <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#aacfe3] text-right">
                {todos.length} task{todos.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </section>

      </div>

      {/* ── Footer ── */}
      <footer className="max-w-xl mx-auto mt-20">
        <div className="h-px bg-gradient-to-r from-transparent via-[#c2dff0] to-transparent mb-6" />
        <p className="text-center text-[10px] font-sans tracking-[0.3em] uppercase text-[#b8d9eb]">
          Next.js · Express · MongoDB
        </p>
      </footer>

    </main>
  );
}