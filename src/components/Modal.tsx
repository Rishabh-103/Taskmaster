"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

export default function Modal({
  addHabit,
  changeModalStatus,
}: {
  addHabit: (habit: any) => void;
  changeModalStatus: () => void;
}) {
  const [dropdown, setDropDown] = useState(false);
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [type, setType] = useState("Daily");

  const handleAddHabit = async () => {
    if (!name || !count || !type) {
      alert("Fill all fields!");
      return;
    }

    try {
      const result = await fetch("/api/habits/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          count: Number(count),
          type,
        }),
      });

      const data = await result.json();

      if (result.ok) {
        addHabit(data.habit);
        changeModalStatus();
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding habit");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-amber-100 shadow-xl border">

        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Add New Habit
          </h2>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-6 py-5">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Habit name</label>
            <input
              type="text"
              placeholder="Enter habit name"
              className="rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Count */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Current count</label>
            <input
              type="number"
              min={0}
              placeholder="Enter current count"
              className="rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </div>

          {/* Type Dropdown */}
          <div className="relative">
            <label className="text-sm text-gray-600">Habit type</label>

            <button
              onClick={() => setDropDown((prev) => !prev)}
              className="mt-1 flex w-full items-center justify-between rounded-md border px-3 py-2 hover:bg-gray-50"
            >
              <span>{type}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {dropdown && (
              <div className="absolute mt-1 w-full rounded-md border bg-white shadow-md">
                {["Daily", "Weekly", "Monthly"].map((option) => (
                  <button
                    key={option}
                    className="w-full px-3 py-2 text-left hover:bg-green-100"
                    onClick={() => {
                      setType(option);
                      setDropDown(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            className="bg-amber-100 px-4 py-2 text-sm text-black hover:cursor-pointer border border-black hover:bg-white"
            onClick={changeModalStatus}
          >
            Exit
          </button>
          <button
            className="bg-amber-100 px-4 py-2 text-sm text-black hover:cursor-pointer border border-black hover:bg-white"
            onClick={handleAddHabit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
