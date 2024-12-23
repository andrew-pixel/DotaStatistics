import "./components.css"
import { useEffect, useState } from "react";
import MiniHeroBar from "./MiniHeroBar";
import {Hero} from "../pages/Homepage"
function HeroList({ heroes, title }: { heroes: Hero[], title: string }) {

  //ranking = (winrate * gamesPlayed) / (gamesPlayed + weight)
  const weight = 10; 
  const sortedHeroes = heroes.sort((a, b) => {
    const aRanking = (a.winrate * a.totalgames) / (a.totalgames + weight);
    const bRanking = (b.winrate * b.totalgames) / (b.totalgames + weight);
  
    return bRanking - aRanking;  // Sort in descending order
  });
  return (
    <div className="heroList" >
        <h1>{title}</h1>
        {sortedHeroes.slice(0,10).map( (hero) => (
          <MiniHeroBar key={hero.heroid} Hero={hero}/>
        ))}
        
    </div>
  );
}

export default HeroList;