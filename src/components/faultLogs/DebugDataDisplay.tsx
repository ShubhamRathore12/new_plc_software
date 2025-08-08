import { useState } from "react";
import { getTagsForMachine } from "@/utils/faultLogs";

interface Props {
  data: any[];
  machineName: string;
}

export default function DebugDataDisplay({ data, machineName }: Props) {
  const [showDebug, setShowDebug] = useState(false);

  if (!showDebug) {
    return (
      <button onClick={() => setShowDebug(true)} className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
        Show Debug Data
      </button>
    );
  }

  const tags = getTagsForMachine(machineName);
  const sampleRecord = data[0] || {};

  return (
    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-yellow-800">Debug Information</h3>
        <button onClick={() => setShowDebug(false)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          Hide
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-yellow-700">Machine: {machineName}</h4>
          <p className="text-sm text-yellow-600">Records found: {data.length}</p>
        </div>

        <div>
          <h4 className="font-medium text-yellow-700">Expected Tags (first 10):</h4>
          <div className="text-sm text-yellow-600 bg-white p-2 rounded border">{tags.slice(0, 10).join(", ")}</div>
        </div>

        <div>
          <h4 className="font-medium text-yellow-700">Sample Record Keys:</h4>
          <div className="text-sm text-yellow-600 bg-white p-2 rounded border max-h-32 overflow-y-auto">
            {Object.keys(sampleRecord).join(", ")}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-yellow-700">Sample Values for Expected Tags:</h4>
          <div className="text-sm text-yellow-600 bg-white p-2 rounded border max-h-32 overflow-y-auto">
            {tags.slice(0, 10).map((tag) => (
              <div key={tag}>
                <strong>{tag}:</strong> {JSON.stringify((sampleRecord as any)[tag])} ({typeof (sampleRecord as any)[tag]})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}