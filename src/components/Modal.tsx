"use client";

import { ChevronDown } from "lucide-react";
import React from "react";
import { useState } from "react";

export default function Modal({
  addHabit,
  changeModalStatus,
}: {
  addHabit: (habit: any) => void;
  changeModalStatus: () => void;
}) {
  const handleAddHabit = async () => {
    if (!name || !count || !type) return alert("Fill all fields!");
    // addHabit({name, count: Number(count), type})
    try {
      const result = await fetch("/api/habits/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, count: Number(count), type }),
      });

      const data = await result.json();

      if (result.ok) {
        alert("Habit added successfully!");
        addHabit(data.habit);
      } else {
        console.error("Error: ", data.message);
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("Error adding habits");
    }
  };

  const [dropdown, setDropDown] = useState(false);
  const [name, setName] = useState("");
  const [count, setCount] = useState("0");
  const [type, setType] = useState("Daily"); // default value

  return (
    <div className="flex fixed justify-center items-center bg-black/50 z-50 shadow-lg inset-0">
      <div className="bg-green-300 p-6 w-full max-w-md flex flex-col border-2 rounded-lg shadow-lg gap-2">
        <input
          required
          type="name"
          placeholder="Enter task name here"
          name="taskName"
          className="border p-2"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>
        <input
          required
          type="number"
          placeholder="Enter count here"
          name="count"
          min={0}
          className="border p-2"
          value={count}
          onChange={(e) => {
            setCount(e.target.value);
          }}
        ></input>
        <button
          className="rounded border p-2 text-white bg-green-400 hover:bg-green-500 max-w-fit flex justify-center items-center"
          onClick={() => setDropDown(!dropdown)}
        >
          Type <ChevronDown className="w-5 h-5" />
        </button>

        {dropdown && (
          <div className="flex flex-col">
            <button
              className="px-2 text-black bg-white hover:bg-white/80 max-w-fit"
              onClick={() => {
                setType("Daily");
                setDropDown(false);
              }}
            >
              Daily
            </button>
            <button
              className="px-2 text-black bg-white hover:bg-white/80 max-w-fit"
              onClick={() => {
                setType("Weekly");
                setDropDown(false);
              }}
            >
              Weekly
            </button>
            <button
              className="px-2 text-black bg-white hover:bg-white/80 max-w-fit"
              onClick={() => {
                setType("Monthly");
                setDropDown(false);
              }}
            >
              Monthly
            </button>
          </div>
        )}
        <div className="flex flex-row justify-between">
          <button
            className="p-2 px-5 text-white bg-green-400"
            onClick={handleAddHabit}
          >
            Add Habit
          </button>
          <button
            className="p-2 text-white bg-green-400"
            onClick={changeModalStatus}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
