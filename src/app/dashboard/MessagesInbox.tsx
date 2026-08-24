"use client";

import { useTransition } from "react";
import { deleteMessage, markMessageRead } from "./actions";
import type { Message } from "@/lib/types";

export default function MessagesInbox({ messages }: { messages: Message[] }) {
  const [isPending, startTransition] = useTransition();

  if (messages.length === 0) {
    return (
      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Messages</h2>
        <p className="mt-2 text-sm text-violet-300">
          Messages sent through your public page&apos;s contact form will show
          up here.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold text-white">
        Messages{" "}
        <span className="text-sm font-normal text-violet-300">
          ({messages.filter((m) => !m.read).length} unread)
        </span>
      </h2>
      <div className="mt-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-xl border p-4 transition ${
              msg.read
                ? "border-white/10 bg-black/10"
                : "border-violet-400/40 bg-violet-500/10"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{msg.name}</p>
                <a
                  href={`mailto:${msg.email}`}
                  className="text-sm text-violet-300 underline"
                >
                  {msg.email}
                </a>
              </div>
              <p className="whitespace-nowrap text-xs text-violet-400">
                {new Date(msg.created_at).toLocaleDateString()}
              </p>
            </div>
            <p className="mt-2 text-sm text-violet-100">{msg.message}</p>
            <div className="mt-3 flex gap-3 text-xs">
              {!msg.read && (
                <button
                  disabled={isPending}
                  onClick={() => startTransition(() => markMessageRead(msg.id))}
                  className="text-violet-300 hover:underline"
                >
                  Mark as read
                </button>
              )}
              <button
                disabled={isPending}
                onClick={() => startTransition(() => deleteMessage(msg.id))}
                className="text-red-300 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
