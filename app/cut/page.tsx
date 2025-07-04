"use client";

import { useState } from "react";
import SheetSvg from "@/components/SheetSvg";
import { demoPartsSet1, demoPartsSet2, demoPartsSet3 } from "@/lib/demoParts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const partsSets = [
  { id: "set1", name: "Furniture Set", parts: demoPartsSet1 },
  { id: "set2", name: "Cabinet Parts", parts: demoPartsSet2 },
  { id: "set3", name: "Frame Assembly", parts: demoPartsSet3 },
];

export default function SheetDemo() {
  const [selectedSet, setSelectedSet] = useState("set1");

  const currentParts = partsSets.find(set => set.id === selectedSet)?.parts || demoPartsSet1;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Sheet layout demo</h1>

      {/* Parts selector */}
      <div className="space-y-3">
        <h2 className="text-lg font-medium">Select Parts Layout</h2>
        <RadioGroup value={selectedSet} onValueChange={setSelectedSet}>
          {partsSets.map((set) => (
            <div key={set.id} className="flex items-center space-x-2">
              <RadioGroupItem value={set.id} id={set.id} />
              <label
                htmlFor={set.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {set.name} ({set.parts.length} parts)
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* 2440 × 1220 mm sheet, 3 mm kerf */}
      <SheetSvg
        sheetW={2440}
        sheetH={1220}
        kerf={3}
        parts={currentParts}
      />
    </main>
  );
}
