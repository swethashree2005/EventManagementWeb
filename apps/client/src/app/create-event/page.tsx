"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const createEvent = async () => {
    console.log("Sending:", { title, description, date });

    const { data, error } = await supabase.from("events").insert([
      {
        title,
        description,
        date,
      },
    ]);

    console.log("Insert result:", data, error);

    if (error) alert("Error creating event: " + error.message);
    else alert("Event created!");
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create Event</h1>

      <div className="space-y-2">
        <Label>Event Title</Label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <Button onClick={createEvent}>Create Event</Button>
    </div>
  );
}
