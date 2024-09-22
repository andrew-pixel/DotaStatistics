import fetch from "node-fetch";
import React, { useEffect, useState } from 'react';

const ProHeroList = () => {
  const [proHeroes, setProHeroes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/prohero')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setProHeroes(data))
      .catch((error) => setError(error.message));
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Pro Heroes</h1>
      <ul>
        {proHeroes.map((hero) => (
          <li key={hero.id}>{hero.name}</li>
        ))}
      </ul>
    </div>
  );
};


async function fetchPublicMatches(minRank: number) {
  const apiUrl = `https://api.opendota.com/api/publicMatches?min_rank=${minRank}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from OpenDota API:", error);
    throw error;
  }
}
async function getPublicMatches() {
  //const apiUrl = `https://api.opendota.com/api/publicMatches?min_rank=${minRank}`;
  const apiUrl = `https://api.opendota.com/api/publicMatches?min_rank=81`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();

    // Now that we have the data, send it to the Express backend
    await sendMatchesToExpress(data);  // Call the function to send data to Express
  } catch (error) {
    console.error("Error fetching data from OpenDota API:", error);
  }
}

async function sendMatchesToExpress(matches) {
  try {
    const response = await fetch('http://localhost:3001/matches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matches),  // Send the matches as JSON
    });

    if (!response.ok) {
      throw new Error('Error sending data to Express');
    }

    const result = await response.json();
    console.log(result);  // Success message from the server
  } catch (error) {
    console.error('Error sending matches to Express:', error);
  }
}

export default ProHeroList;
