"use client";

import { useEffect, useState } from "react";

const FetchData = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const res = await fetch("/api/getData");
      const result = await res.json();
      setData(result); // Set the fetched data
      setLoading(false); // Update loading state
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Use useEffect to start polling every second
  useEffect(() => {
    // Initial data fetch
    fetchData();

    // Set up polling every second (1000ms)
    const intervalId = setInterval(fetchData, 100000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Fetched Data</h1>
      <ul>
        {data.map((row: { id: string; t0: string; t1: string }) => (
          <li key={row.id}>
            {row.t0} - {row.t1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FetchData;
