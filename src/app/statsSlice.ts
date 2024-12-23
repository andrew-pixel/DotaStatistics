import React, { useEffect } from 'react';

function ComputeStats(){
  useEffect(() => {
    const computeImpactStats = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/computeStats`)

        if (response.ok) {
          console.log('Impact stats computed successfully');
        } else {
          const message = await response.text();
          console.error('Failed to compute impact stats:', message);
        }
      } catch (error) {
        console.error('Error calling compute-impact-stats route:', error);
      }
    };
    console.log("COMPUTATIONS CALLED")
    computeImpactStats(); 
  }, []); 

  return null; 
};

export default ComputeStats;