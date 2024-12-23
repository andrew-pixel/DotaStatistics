import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import "./components.css"
import { MatchData } from "./types";
import { useNavigate } from "react-router-dom";
import { MiniMatchData } from '../pages/Heropage';
import ItemSet from "./ItemSet";
import { match } from "assert";

function MatchBar({ matchdata, heroid, clickable = true, selected=false }: 
  { matchdata: MiniMatchData; heroid: number, clickable?: boolean, selected?:boolean }) {
  const navigate = useNavigate();
  const { icons = [], loading, error } = useSelector((state: RootState) => state.heroIcons);
  const handleClick = () => {
    //if (clickable) {
    if(false){
      navigate("/Matchpage", { state: { matchdata: matchdata } });
    }
  };

  const heroData = icons.find(icon => icon.heroid === heroid);
  const heroUrl = heroData?.url;
  const heroName = heroData?.heroname;
  return (
    <div className="matchBar" onClick={handleClick} style={{
       backgroundColor: selected ? 'var(--dark2)' : 'var(--backgroundcolor2)'
    }}>
    <div>
    <h3>Match ID {matchdata.matchid}</h3>
    <img src={heroUrl} alt="Hero" className="heroImage" />
    </div>
    <div className="matchDetails">
      
      <h3>GPM {matchdata.gpm}  XPM {matchdata.xpm}</h3>
      
      </div>
      <div>
      <ItemSet items={matchdata.items} />
      </div>
  </div>
  );
}

export default MatchBar;
