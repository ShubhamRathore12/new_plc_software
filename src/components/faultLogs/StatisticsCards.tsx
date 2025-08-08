import { Stats } from "@/utils/faultLogs";

export default function StatisticsCards({ stats }: { stats: Stats }) {
  const getGradientClass = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "green":
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "red":
        return "bg-gradient-to-r from-red-500 to-red-600";
      case "purple":
        return "bg-gradient-to-r from-purple-500 to-purple-600";
      case "yellow":
        return "bg-gradient-to-r from-amber-500 to-yellow-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {[
        { label: "Total Records", value: stats.total, color: "blue" },
        { label: "Tag Data", value: stats.activeTags, color: "green" },
        { label: "Fault Tags", value: stats.faultTags, color: "red" },
        { label: "Current Page", value: stats.currentPage, color: "purple" },
        { label: "Total Pages", value: stats.totalPages, color: "yellow" },
      ].map((stat, idx) => (
        <div
          key={idx}
          className={`${getGradientClass(stat.color)} p-5 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden`}
        >
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-white text-opacity-90 mb-2">{stat.label}</h3>
            <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10" />
        </div>
      ))}
    </div>
  );
}