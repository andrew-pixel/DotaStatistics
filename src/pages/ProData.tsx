import React, { useState, useEffect } from 'react';

const ImpactStats = () => {
  const [impactStats, setImpactStats] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading", "success", or error message
  const maxRetries = 1;

  const fetchImpactStats = async (retryCount = 0) => {
    setStatus("loading");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/computeImpactStats`);
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error?.includes("daily api limit exceeded")) {
          setStatus("API limit exceeded. Please try again later.");
          throw new Error('API limit exceeded');
        }
        throw new Error('Failed to fetch');
      }
      const data = await response.text();
      //setImpactStats(data);
      setStatus("success");
    } catch (error) {
      console.error('Error fetching impact stats:', error);
      if (retryCount < maxRetries) {
        setTimeout(() => fetchImpactStats(retryCount + 1), 2000); // Retry after 2 seconds
      } else {
        setStatus("Failed to fetch data. Please try again later.");
      }
    }
  };
  const debug = true
  useEffect(() => {
    if(!debug){
      console.log("processing matches")
      fetchImpactStats();
    }
  }, []);
  
  

  return (
    null
  );
};
export default ImpactStats;