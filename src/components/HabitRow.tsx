"use client";
import { CirclePlus } from "lucide-react";

type Habit = {
  _id: string;
  name: string;
  type: "Daily" | "Weekly" | "Monthly";
  count: number;
  createdAt: string;
  lastCompletedAt: string | null;
};

type Props = {
  habit: Habit;
  completed: boolean;
  deleteMode: boolean;
  selected: boolean;
  editingId: string | null;
  tempName: string;
  setTempName: (v: string) => void;
  setEditingId: (v: string | null) => void;
  onToggleSelect: () => void;
  onUpdate: (id: string, updates: Partial<Habit>) => void;
};

export default function HabitRow({
  habit,
  completed,
  deleteMode,
  selected,
  editingId,
  tempName,
  setTempName,
  setEditingId,
  onToggleSelect,
  onUpdate,
}: Props) {
  return (
    <tr
      className={`
        ${completed ? "opacity-50 line-through bg-green-50" : ""}
        ${selected ? "bg-red-100/50" : ""}
      `}
    >
      {deleteMode && (
        <td className="px-4 py-2">
          <input type="checkbox" checked={selected} onChange={onToggleSelect} />
        </td>
      )}

      {/* Name */}
      <td className="px-4 py-2 font-medium">
        {editingId === habit._id ? (
          <input
            className="border px-2 py-1 w-full"
            value={tempName}
            autoFocus
            onChange={(e) => setTempName(e.target.value)}
            onBlur={() => {
              onUpdate(habit._id, { name: tempName });
              setEditingId(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onUpdate(habit._id, { name: tempName });
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
            className={
              completed
                ? "cursor-not-allowed text-gray-400"
                : "hover:text-green-600"
            }
            onClick={() =>
              onUpdate(habit._id, {
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
            onUpdate(habit._id, {
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
        {new Date(habit.createdAt).toLocaleDateString("en-GB")}
      </td>
    </tr>
  );
}
