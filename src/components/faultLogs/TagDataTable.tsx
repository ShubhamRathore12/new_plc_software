import { TagData } from "@/utils/faultLogs";
import TagDataRow from "./TagDataRow";

export default function TagDataTable({ tagData }: { tagData: TagData[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tag Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Value</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {tagData.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No tag data found</td>
            </tr>
          ) : (
            tagData.map((row, idx) => <TagDataRow key={`${row.tag}-${row.createdAt}-${idx}`} tagData={row} />)
          )}
        </tbody>
      </table>
    </div>
  );
}