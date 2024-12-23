import React, { useEffect } from 'react';

function PublicMatches(){
  useEffect(() => {
    const dailyFetch = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/fetchMatches`)

        if (response.ok) {
          console.log('public matches handled');
        } else {
          const message = await response.text();
          console.error('Failed to compute impact stats:', message);
        }
        const res = await fetch(`${process.env.REACT_APP_API_URL}/computeStats`)
        if (res.ok) {
            console.log('public matches handled');
          } else {
            const message = await res.text();
            console.error('Failed to compute impact stats:', message);
          }
      } catch (error) {
        console.error('Error calling compute-impact-stats route:', error);
      }
    };
    console.log("COMPUTATIONS CALLED")
    dailyFetch(); 
  }, []); 

  return null; 
};

export default PublicMatches;