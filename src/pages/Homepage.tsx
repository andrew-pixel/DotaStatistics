import HeroList from '../components/HeroList';
import "./Homepage.css"
import { useEffect, useState } from 'react';
export interface Hero {
  heroid: number;
  totalgames: number;
  wins:number;
  winrate: number;
  supportpoints: number;
  corepoints: number;
  lanerole1: number;
  lanerole2: number;
  lanerole3: number;
  iscore: boolean;
}
function Homepage(){
  const [winrates, setWinrates] = useState([]);
  
  useEffect(() =>{
  async function fetchWinrates(){
    const response = await fetch(`${process.env.REACT_APP_API_URL}/fetchWinrates`);
    const data = await response.json();
    setWinrates(data)
  }
  fetchWinrates();
  }
  ,[])
  const offlaner = winrates.filter((hero: Hero)=> {
    
    const max = Math.max(hero.lanerole1, hero.lanerole2, hero.lanerole3);

   return max === hero.lanerole3 && hero.iscore;
  })
    const carry : Hero[] = winrates.filter((hero: Hero)=> {
    
      const max = Math.max(hero.lanerole1, hero.lanerole2, hero.lanerole3);
  
     return max === hero.lanerole1 && hero.iscore;
    })   // 1 might represent safe lane/carry
  const mid = winrates.filter((hero: Hero)=> {
    
    const max = Math.max(hero.lanerole1, hero.lanerole2, hero.lanerole3);

   return max === hero.lanerole2 && hero.iscore;
  })
  const support = winrates.filter((hero: Hero)=> {
    
    const max = Math.max(hero.lanerole1, hero.lanerole2, hero.lanerole3);

   return max === hero.lanerole3 && !hero.iscore;
  })
  const support5 = winrates.filter((hero: Hero)=> {
    
    const max = Math.max(hero.lanerole1, hero.lanerole2, hero.lanerole3);

   return max === hero.lanerole1 && !hero.iscore;
  })
    return(
    <div className='mainContainer'>
      <h1>Top Heroes</h1>
    <div className='positionContainer'>
      <HeroList heroes={carry} title="Safelane"/>
      <HeroList heroes={mid} title="Midlaner"/>
      <HeroList heroes={offlaner} title="Offlane"/>
      <HeroList heroes={support} title="Support"/>
      <HeroList heroes={support5} title="Hard Support"/>
    </div>
    </div>
    );
  }
  
export default Homepage;