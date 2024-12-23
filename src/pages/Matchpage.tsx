import React, { useState, useEffect } from 'react';
import './Matchpage.css';

import { MatchData } from '../components/types';
import HeroBar from '../components/HeroBar';
import { useLocation } from 'react-router-dom';
import { MiniMatchData } from './Heropage';

export interface MatchHeroStats {
  heroid: number;
  accountid: number;
  matchid: number;
  kills: number;
  deaths: number;
  assists: number;
  playerslot: number;
  level: number;
  networth: number;
  gpm:number;
  xpm: number;
  items: number[];
  duration: number;
  radiantWin: boolean;
  lanerole: number;
}
function Matchpage() {
  const location = useLocation();

  const matchData : MiniMatchData = location.state?.matchdata;  // Access matchdata from state directly
  const [data, setData] = useState<MatchHeroStats[] | null>(null);
  useEffect(() =>{
    async function fetchSpecificMatch(){
      
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}
/fetchSpecificMatch/${matchData.matchid}`);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const res : MatchHeroStats[] = await response.json();
        setData(res);  
      } catch (error) {
        console.log(error)
      }
      
    }
    if (matchData.matchid) {
      fetchSpecificMatch();
    }

  },[matchData])

  if (!matchData) {
    return <p>RAT go back and select a match.</p>;
  }
  if(data === null){
    return <p>ASSSSSSSSSSSSSSSSSSSSSSS</p>;
  }
  
  return (
    <div className='matchPage'>

    <h1>Match ID: {data[0]?.matchid}</h1>
    
    <h1>Radiant</h1>
    <div className="headerBar">
      <div className="groupHeader">Level</div>
      <div className="groupHeader kdaGroup">
        <span>K</span>
        <span>D</span>
        <span>A</span>
      </div>
      <div className="groupHeader">GPM</div>
      <div className="groupHeader">XPM</div>
      <div className="groupHeader">Net Worth</div>
      <div className="groupHeader itemsHeader">Items</div>
    </div>
    {data.slice(0,5).map( (hero) => (
          <HeroBar hero={hero}/>
        ))}
    <h1>Dire</h1>  
    <div className="headerBar">
      <p>Level</p>
      <p>K</p>
      <p>D</p>
      <p>A</p>
      <p>GPM</p>
      <p>XPM</p>
      <p>Net Worth</p>
    </div>
    {data.slice(5,10).map( (hero) => (
          <HeroBar hero={hero}/>
        ))}
    </div>
  );
}



export default Matchpage;
