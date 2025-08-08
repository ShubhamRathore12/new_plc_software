import { TagData, formatTagName, getTagCategory } from "@/utils/faultLogs";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TagDataRow({ tagData }: { tagData: TagData }) {
  const { tFault, tUI } = useLanguage();
  const category = getTagCategory(tagData.tag);

  const getCategoryStyle = (cat: string) => {
    switch (cat) {
      case "fault":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  const isActiveValue = (value: any) => {
    return (
      value === true ||
      value === 1 ||
      value === "true" ||
      value === "1" ||
      value === "True"
    );
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium">{tagData.tag}</td>
      <td className="px-4 py-3 text-sm">
        {tFault(tagData.tag) || formatTagName(tagData.tag)}
      </td>
      <td className="px-4 py-3 text-sm">
        {isActiveValue(tagData.value) && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {String(tagData.value)}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(
            category
          )}`}
        >
          {tUI("FAULT")}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">{tagData.createdAt}</td>
    </tr>
  );
}
