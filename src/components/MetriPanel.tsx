import { useEffect, useState } from "react";
import { Thermometer, Gauge, Droplet, Flame, Wind, Clock } from "lucide-react";

// Generate random data for the metrics
const generateMetricsData = () => {
  return {
    temperature: Math.floor(65 + Math.random() * 15),
    pressure: Math.floor(60 + Math.random() * 25),
    humidity: Math.floor(40 + Math.random() * 35),
    heatOutput: Math.floor(70 + Math.random() * 20),
    airflow: Math.floor(50 + Math.random() * 30),
  };
};

const MetricsPanel = () => {
  const [metrics, setMetrics] = useState(generateMetricsData());
  const [time, setTime] = useState(new Date());

  // Update metrics every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateMetricsData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Live System Data
          </span>
        </div>
        <div className="text-sm font-medium">{formatTime(time)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {/* Temperature Metric */}
        <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Thermometer className="h-4 w-4 mr-2 text-red-500" />
              <span className="text-xs">TEMPERATURE</span>
            </div>
            <span className="text-sm font-bold">{metrics.temperature}°C</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-1.5 rounded-full">
            <div
              className="bg-red-500 h-1.5 rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${metrics.temperature}%` }}
            ></div>
          </div>
        </div>

        {/* Pressure Metric */}
        <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Gauge className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-xs">PRESSURE</span>
            </div>
            <span className="text-sm font-bold">{metrics.pressure}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-1.5 rounded-full">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${metrics.pressure}%` }}
            ></div>
          </div>
        </div>

        {/* Humidity Metric */}
        <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Droplet className="h-4 w-4 mr-2 text-teal-500" />
              <span className="text-xs">HUMIDITY</span>
            </div>
            <span className="text-sm font-bold">{metrics.humidity}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-1.5 rounded-full">
            <div
              className="bg-teal-500 h-1.5 rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${metrics.humidity}%` }}
            ></div>
          </div>
        </div>

        {/* Heat Output Metric */}
        <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Flame className="h-4 w-4 mr-2 text-orange-500" />
              <span className="text-xs">HEAT OUTPUT</span>
            </div>
            <span className="text-sm font-bold">{metrics.heatOutput}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-1.5 rounded-full">
            <div
              className="bg-orange-500 h-1.5 rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${metrics.heatOutput}%` }}
            ></div>
          </div>
        </div>

        {/* Airflow Metric */}
        <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Wind className="h-4 w-4 mr-2 text-purple-500" />
              <span className="text-xs">AIRFLOW</span>
            </div>
            <span className="text-sm font-bold">{metrics.airflow}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-1.5 rounded-full">
            <div
              className="bg-purple-500 h-1.5 rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${metrics.airflow}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
        <div>Last updated: just now</div>
        <div>Refresh rate: 5s</div>
      </div>
    </div>
  );
};

export default MetricsPanel;
