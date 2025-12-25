"use client";
import { CirclePlus, HomeIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Modal from "@/components/Modal";

export default function Home() {
  // PART A: HABIT PART
  type Habit = {
    _id: string;
    name: string;
    type: "Daily" | "Weekly" | "Monthly";
    count: number;
    createdAt: string;
    lastCompletedAt: string | null;
  };

  const [habitDict, setHabitDict] = useState<Habit[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteMode, setDeleteMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHabits() {
      try {
        const res = await fetch("/api/habits");
        if (!res.ok) throw new Error("Failed to fetch habits");

        const data = await res.json();
        setHabitDict(data);
      } catch (err) {
        console.error(err);
        setHabitDict([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHabits();
  }, []);

  const addHabit = (habit: any) => {
    setHabitDict((prev) => [...prev, habit]);
    setIsModalOpen(false);
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    await fetch("/api/habits", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates }),
    });

    setHabitDict((prev) =>
      prev.map((habit) => (habit._id === id ? { ...habit, ...updates } : habit))
    );
  };

  // PART B: MODAL PART
  const [isModalOpen, setIsModalOpen] = useState(false);

  const changeModalStatus = () => {
    setIsModalOpen(false);
  };

  // PART C: MISC

  const formatted = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function isCompletedForPeriod(habit: Habit) {
    if (!habit.lastCompletedAt) return false;

    const last = new Date(habit.lastCompletedAt);
    const now = new Date();

    if (habit.type === "Daily") {
      return last.toDateString() === now.toDateString();
    }

    if (habit.type === "Weekly") {
      const startOfWeek = (d: Date) => {
        const date = new Date(d);
        date.setDate(d.getDate() - d.getDay());
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      };
      return startOfWeek(last) === startOfWeek(now);
    }

    if (habit.type === "Monthly") {
      return (
        last.getMonth() === now.getMonth() &&
        last.getFullYear() === now.getFullYear()
      );
    }

    return false;
  }

  return (
    <div>
      {/* PART D: NAVBAR */}
      <nav className="flex text-lg shadow-md px-3 py-2 bg-green-100 items-center justify-between">
        <Link
          href="/"
          className="px-3 py-2 mx-1 hover:bg-black/10 hover:rounded-lg"
        >
          <HomeIcon />
        </Link>
        <Link
          href="/"
          className="px-3 py-2 mx-1 hover:bg-black/10 hover:rounded-lg"
        >
          About
        </Link>
        <Link
          href="/"
          className="px-3 py-2 mx-1 hover:bg-black/10 hover:rounded-lg"
        >
          Help
        </Link>
        <Link
          href="/"
          className="px-3 py-2 mx-1 hover:bg-black/10 hover:rounded-lg"
        >
          Contact
        </Link>

        <Link
          href="/"
          className="ml-auto px-3 py-2 mx-1 hover:bg-black/10 hover:rounded-lg"
        >
          Login
        </Link>
        <Link
          href="/"
          className="px-3 py-2 mx-1 hover:bg-black/10 hover:rounded-lg"
        >
          Signup
        </Link>
      </nav>
      <hr></hr>
      <main>
        <div className="shadow-md text-lg bg-white flex justify-center items-center min-h-screen">
          <div className="checkboxes bg-amber-100 min-w-md shadow-lg p-3 border rounded">
            <div className="heading flex min-w-full justify-between items-center">
              <h2 className="font-bold text-2xl p-2">{formatted}</h2> {/*date*/}
              <button
                className="bg-transparent border px-3 m-3 font-semibold hover:cursor-pointer"
                onClick={() => {
                  setIsModalOpen(!isModalOpen); // modal
                }}
              >
                {" "}
                + Add
              </button>
              <button
                className="bg-transparent border px-3 m-3 font-semibold hover:bg-red-100"
                onClick={async () => {
                  // Enter delete mode first
                  if (!deleteMode) {
                    setDeleteMode(true);
                    return;
                  }

                  // If already in delete mode, perform deletion
                  if (selectedIds.size === 0) {
                    alert("Select at least one habit to delete.");
                    return;
                  }

                  if (!confirm("Delete selected habits?")) return;

                  await fetch("/api/habits", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ids: Array.from(selectedIds) }),
                  });

                  setHabitDict((prev) =>
                    prev.filter((habit) => !selectedIds.has(habit._id))
                  );

                  // Reset state
                  setSelectedIds(new Set());
                  setDeleteMode(false);
                }}
              >
                <Trash2 className="inline w-4 h-4 mr-1" />
                {deleteMode ? "Confirm Delete" : "Delete"}
              </button>
              {isModalOpen && (
                <Modal
                  addHabit={addHabit}
                  changeModalStatus={changeModalStatus}
                />
              )}
            </div>
            <hr className="p-1"></hr>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-black/20">
                  {deleteMode && (
                    <th className="px-4 py-2 w-10  whitespace-nowrap"></th>
                  )}
                  <th className="text-left px-4 py-2 w-2/5  whitespace-nowrap">
                    Task Name
                  </th>
                  <th className="text-left px-4 py-2 w-1/5  whitespace-nowrap">
                    Count
                  </th>
                  <th className="text-left px-4 py-2 w-1/5 whitespace-nowrap">
                    Type
                  </th>
                  <th className="text-left px-4 py-2 w-2/5 whitespace-nowrap">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={deleteMode ? 5 : 4}
                      className="text-center py-4"
                    >
                      Loading habits...
                    </td>
                  </tr>
                ) : habitDict.length === 0 ? (
                  <tr>
                    <td
                      colSpan={deleteMode ? 5 : 4}
                      className="text-center py-4"
                    >
                      No habits yet. Add one!
                    </td>
                  </tr>
                ) : (
                  [...habitDict]
                    .sort((a, b) => {
                      return (
                        Number(isCompletedForPeriod(a)) -
                        Number(isCompletedForPeriod(b))
                      );
                    })
                    .map((habit) => {
                      const completed = isCompletedForPeriod(habit);

                      return (
                        <tr
                          key={habit._id}
                          className={`
        ${completed ? "opacity-50 line-through bg-green-50" : ""}
        ${selectedIds.has(habit._id) ? "bg-red-100/50" : ""}
      `}
                        >
                          {deleteMode && (
                            <td className="px-4 py-2">
                              <input
                                type="checkbox"
                                checked={selectedIds.has(habit._id)}
                                onChange={() => {
                                  setSelectedIds((prev) => {
                                    const next = new Set(prev);
                                    next.has(habit._id)
                                      ? next.delete(habit._id)
                                      : next.add(habit._id);
                                    return next;
                                  });
                                }}
                              />
                            </td>
                          )}

                          {/* Task Name */}
                          <td className="px-4 py-2 font-medium">
                            {editingId === habit._id ? (
                              <input
                                className="border px-2 py-1 w-full"
                                value={tempName}
                                autoFocus
                                onChange={(e) => setTempName(e.target.value)}
                                onBlur={() => {
                                  updateHabit(habit._id, { name: tempName });
                                  setEditingId(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    updateHabit(habit._id, { name: tempName });
                                    setEditingId(null);
                                  }
                                }}
                              />
                            ) : (
                              <span
                                className="flex items-center gap-2 cursor-pointer hover:shadow-md p-2"
                                onClick={() => {
                                  setEditingId(habit._id);
                                  setTempName(habit.name);
                                }}
                              >
                                {completed && <span className="text-green-600">✓</span>}
                                {habit.name}
                              </span>
                            )}
                          </td>

                          {/* Count */}
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <span>{habit.count}</span>
                              <button
                                disabled={completed}
                                className={`
    ${completed ? "cursor-not-allowed text-gray-400" : "hover:text-green-600"}
  `}
                                onClick={() =>
                                  updateHabit(habit._id, {
                                    count: habit.count + 1,
                                    lastCompletedAt: new Date().toISOString(),
                                  })
                                }
                              >
                                <CirclePlus className="w-5 h-5" />
                              </button>
                            </div>
                          </td>

                          {/* Type */}
                          <td className="px-4 py-2">
                            <select
                              className="border px-2 py-1"
                              value={habit.type}
                              onChange={(e) =>
                                updateHabit(habit._id, {
                                  type: e.target.value as Habit["type"],
                                })
                              }
                            >
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                            </select>
                          </td>

                          {/* Created */}
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {new Date(habit.createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
