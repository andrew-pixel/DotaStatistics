import HeroList from '../components/HeroList';
import ItemIcon from '../components/ItemIcon';
import MatchBar from '../components/MatchBar';
import "./Heropage.css"
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
export interface HeroStats {
  heroid: number;
  gpm: number;
  xpm: number;

  lanerole1: number;
  lanerole2: number;
  lanerole3: number;
  topitems: { item: number; count: number }[];
  total_matches: number;
  total_wins: number;
}
export interface MiniMatchData {
  matchid: number;
  heroName: string;
  gpm: number;
  xpm: number;
  items: number[];
  win: boolean;
  duration: number;
}
function Heropage() {
  const location = useLocation();
  const { heroid, heroName, winrate, wins, totalgames, url} = location.state as { 
    heroid: number; 
    heroName: string;
    winrate: string; 
    wins: number; 
    totalgames: number; 
    url: string;
  }
  const [heroData, setHeroData] = useState<HeroStats | null>(null);
  const [miniMatchData, setMiniMatchData] = useState<MiniMatchData[]>([]);
  useEffect(() => {

    async function fetchHeroData() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/fetchHeroAvgStats/${heroid}`);
      const data : HeroStats  = await response.json();
      const matchResponse = await fetch(`${process.env.REACT_APP_API_URL}/fetchHeroStats/${heroid}`);
      const matchData : MiniMatchData[] = await matchResponse.json();

      setHeroData(data);
      setMiniMatchData(matchData);
    }

    fetchHeroData();
  }, [heroid]);
  
  if (!heroData) {
    return <div>Loading...</div>;
  }

  return (
    
      <div className="heroContainer">
  <div className="heroHeader">
  <div>
      <h1>{heroName}</h1>
      <p>Winrate: {winrate}%</p>
    </div>
    <img src={url} alt="Hero Image" />
    
  </div>
      <section className='stats'>
        <h2>General Stats</h2>
        <p>Games Played: {totalgames}</p>
        <p>Wins: {wins}</p>
        
      </section>

      <section className='topitems'>
        <h2>Top Items</h2>
        <ul>
          {heroData.topitems.slice(0,20).map((item) =>(
            <li key={item.item} className="itemIcon">
            <ItemIcon itemCode={item.item} />
          </li>
          ))}
        </ul>
      </section>
          
      <section className='matches'>
        <h2>Match Performance</h2>
        {miniMatchData.map((match) => (
          <MatchBar 
            key={match.matchid} 
            matchdata={match} 
            heroid={heroid}
          />
        ))}
      </section>
    </div>
  );
}
export default Heropage;