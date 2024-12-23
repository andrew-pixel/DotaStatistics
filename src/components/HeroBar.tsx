import ItemSet from "./ItemSet";
import { MatchHeroStats } from "../pages/Matchpage";
import "./components.css"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

//the 10 individual hero bars in a matchpage
function HeroBar({hero} : {hero:MatchHeroStats}) {
  const { icons = [], loading, error } = useSelector((state: RootState) => state.heroIcons);
  const navigate = useNavigate();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const heroIcon = icons.find(icon => icon.heroid === hero.heroid);
  //if (icons.length === 0 || !icons[Hero.heroid - 2]){ 
    if (!heroIcon) {
      console.log(`Hero icon not found for heroid: ${hero.heroid}`);
      return <div></div>; 
    }
  
  
  const url = heroIcon.url;
  return (
    <div className="heroBar" >
      <img className="heroIcon" src={heroIcon.url}/>
      <div className="performanceStats">
        <p>K: {hero.kills}</p>
        <p>D: {hero.deaths}</p>
        <p>A: {hero.assists}</p>
      </div>

      <div className="heroStats">
        <p>Account ID: {hero.accountid}</p>
        <p>Level: {hero.level}</p>
        <p>Net Worth: {hero.networth.toLocaleString()}</p>
        <p>GPM: {hero.gpm}</p>
        <p>XPM: {hero.xpm}</p>
      </div>

      {/* Performance Stats */}
      
      <ItemSet  items={hero.items}/>
      
      
    </div>
  );
}


export default HeroBar;
