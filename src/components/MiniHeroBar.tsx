import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import "./components.css"
import { Hero } from "../pages/Homepage"; 
import { useNavigate } from "react-router-dom";
function MiniHeroBar({Hero } : {Hero:Hero}) {
  const { icons = [], loading, error } = useSelector((state: RootState) => state.heroIcons);
  const navigate = useNavigate();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const heroIcon = icons.find(icon => icon.heroid === Hero.heroid);
  //if (icons.length === 0 || !icons[Hero.heroid - 2]){ 
    if (!heroIcon) {
      console.log(`Hero icon not found for heroid: ${Hero.heroid}`);
      return <div></div>; 
    }
  const url = heroIcon.url;
  const handleClick = () => {
    navigate("/hero-page", { state: { 
      heroid: Hero.heroid,
      heroName: heroIcon.heroname,
      wins: Hero.wins,
      totalgames: Hero.totalgames,
      winrate: ((Hero.wins / Hero.totalgames) * 100).toFixed(1),
      url: url
    }  });
  };

  return (
    <div className="miniHeroBar" onClick={handleClick}>
      <img src={url}/>
      <h3>{heroIcon.heroname } &nbsp;</h3>
      <h3>{Hero.wins}W/{Hero.totalgames}G&nbsp; </h3>
      <h3>{((Hero.wins/Hero.totalgames)*100).toFixed(1) + "%"}</h3>
    </div>
  );
}

 
export default MiniHeroBar;
