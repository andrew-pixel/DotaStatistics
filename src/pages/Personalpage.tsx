import MatchBar from "../components/MatchBar";
import "./Personalpage.css";
import { useState, useEffect } from "react";
import { MiniMatchData } from "./Heropage";
import Graph from "../components/Graph";

interface Match {
  match_id: number;
  radiant_win: boolean;
  player_slot: number;
  hero_id: number;
  version: number | null;
}
export interface HeroImpact {
  matchid: number;
  minute: number;
  impactPoints: number;
  gold: number;
  xp: number;
  kills: number;
  teamfightParticipation: number;
  damage: number;
}

interface ExtendedMatchData extends MiniMatchData {
  heroId: number;

}
interface ImpactStats {
  matchid: number;
  perMinuteGold: number[];
  perMinuteXp: number[];
  teamfight: number;
  damage: number;
  kills: { time: number }[];
  deaths: { time: number }[];
  assists: number;
  itemsM: { item_id: number, time: number }[];
  kda: number;
}

interface PlayerData {
  steamId: number;
  username: string;
  avatar: string;
}
export interface MinuteImpactData {
  matchid: number;
  minute: number;
  impactPoints: number;
}
function PersonalPage() {
  const [steamid, setSteamid] = useState<number | null>(null);
  const [matches, setMatches] = useState<ExtendedMatchData[]>([]);
  const [impactData, setImpactData] = useState<HeroImpact[]>([]);
  const [winRate, setWinRate] = useState<number | null>(null);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<ExtendedMatchData | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(null), 5000); // Clear after 5 seconds
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);
  useEffect(() => {
    const fetchMatchData = async () => {
      if (!steamid) return;
      const playerResponse = await fetch(`https://api.opendota.com/api/players/${steamid}`);
      const playerInfo = await playerResponse.json();

      setPlayerData({
        steamId: steamid,
        username: playerInfo.profile.personaname,
        avatar: playerInfo.profile.avatarfull,
      });
      const now = Date.now();
      const lastFetch = Number(localStorage.getItem("lastFetchTime") || 0);
      //const oneDay = 24 * 60 * 60 * 1000;
      const oneDay = 24 * 60 * 60 * 1000;
      const timeLeft = oneDay - (now - lastFetch);
      if (now - lastFetch < oneDay) {
        const storedMatches = localStorage.getItem("lastFetchedMatches");
        const storedImpactData = localStorage.getItem("lastFetchedImpactData");
        if (storedMatches && storedImpactData) {
          const parsed = JSON.parse(storedMatches)
          setMatches(parsed);
          setSelectedMatch(parsed[0])
          setImpactData(JSON.parse(storedImpactData));
          const parsedMatches = JSON.parse(storedMatches) as ExtendedMatchData[]
          const wins = parsedMatches.filter(match => match.win).length;

          setWinRate((wins / parsedMatches.length) * 100);
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

          setErrorMessage(
            `Sorry, you already used your data call. Try again in: ${hours}h ${minutes}m ${seconds}s`
          );
          return;
        }
      }
      const response = await fetch(`https://api.opendota.com/api/players/${steamid}/matches?limit=15`);
      const matchList: Match[] = await response.json();
      const parsedMatches = matchList
        .filter(match => {
          return match.version !== null;
        })
        .slice(0, 5);


      const wins = parsedMatches.filter(match =>
        (match.radiant_win && match.player_slot < 128) ||
        (!match.radiant_win && match.player_slot >= 128)
      ).length;

      setWinRate((wins / parsedMatches.length) * 100);
      const impactStatsList: ImpactStats[] = [];

      const updatedMatches = await Promise.all(
        parsedMatches.map(async match => {
          const matchDetails = await fetch(`https://api.opendota.com/api/matches/${match.match_id}`);
          const matchData = await matchDetails.json();
          const playerData = matchData.players.find((p: any) => p.account_id === steamid);

          const getDifference = (data: number[], interval = 1) => {
            const gpm = [];
            for (let i = 1; i < data.length; i++) {
              const goldDifference = data[i] - data[i - 1];
              gpm.push(goldDifference / interval);
            }
            return gpm;
          };

          const impactStats: ImpactStats = {
            matchid: match.match_id,
            perMinuteGold: getDifference(playerData.gold_t) || [],
            perMinuteXp: getDifference(playerData.xp_t) || [],
            itemsM: playerData.purchase_log || [],
            teamfight: playerData.teamfight_participation || 0,
            damage: playerData.benchmarks?.hero_damage_per_min?.raw || 0,
            kills: playerData.kills_log || [],
            deaths: playerData.deaths_log || [],
            assists: playerData.assists || 0,
            kda: playerData.kda || 0
          };
          impactStatsList.push(impactStats);
          return {
            matchid: match.match_id,
            heroId: match.hero_id,
            heroName: playerData.personaname,
            gpm: playerData.gold_per_min,
            xpm: playerData.xp_per_min,
            win: (match.radiant_win && match.player_slot < 128) ||
              (!match.radiant_win && match.player_slot >= 128),
            items: [
              playerData.item_0,
              playerData.item_1,
              playerData.item_2,
              playerData.item_3,
              playerData.item_4,
              playerData.item_5,
              playerData.backpack_0,
              playerData.backpack_1,
              playerData.backpack_2,
              playerData.item_neutral
            ],

          } as ExtendedMatchData;
        })
      );

      setMatches(updatedMatches);
      setSelectedMatch(updatedMatches[0])
      console.log(impactStatsList)

      const computedImpactData = computeImpact(impactStatsList);
      setImpactData(computedImpactData);
      localStorage.setItem("lastFetchTime", now.toString());
      localStorage.setItem("lastFetchedMatches", JSON.stringify(updatedMatches));
      localStorage.setItem("lastFetchedImpactData", JSON.stringify(computedImpactData));
    };

    fetchMatchData();
  }, [steamid]);

  function computeImpact(matches: ImpactStats[]): HeroImpact[] {
    const impactData: HeroImpact[] = [];
    matches.forEach(match => {
      for (let minute = 0; minute < match.perMinuteGold.length; minute++) {
        const gold = match.perMinuteGold[minute] || 0;
        const xp = match.perMinuteXp[minute] || 0;
        const teamfightParticipation = match.teamfight > 0 ? 10 * match.teamfight : 0;
        const kills = match.kills.filter(kill => kill.time > (minute - 1) * 60 && kill.time <= minute * 60).length;
        const deaths = match.deaths.filter(death => death.time > (minute - 1) * 60 && death.time <= minute * 60).length;
        const itemsPurchased = match.itemsM.filter(item => item.time > (minute - 1) * 60 && item.time <= minute * 60).length;
        const damage = match.damage || 0
        const impactPoints =
          (gold * 0.5) +
          (xp * 0.3) +
          (kills * 20) +
          //(deaths * 15) +
          (teamfightParticipation * 5) +
          //(itemsPurchased * 10) +
          damage;

        impactData.push({
          matchid: match.matchid,
          minute,
          impactPoints,
          gold,
          xp,
          kills,
          teamfightParticipation,
          damage
        });
      }
    });

    return impactData;
  }

  const handleSteamIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length >= 6 && e.target.value.length <= 10 && !isNaN(Number(e.target.value))) {
      setSteamid(Number(e.target.value));
    }
  };

  const selectedMatchData = impactData.filter(match => match.matchid === selectedMatch?.matchid);
  //1070668144
  if (!steamid) {
    return (
      <div className="personal">
        <div className="steamid-input">
          <h2>Enter Steam ID</h2>

          <input
            type="number"
            placeholder="Enter Steam ID"
            onChange={handleSteamIDChange} />
        </div>
      </div>
    );
  }
  return (
    <div className="personal">
      <h2>Match Impact Analysis</h2>
      <div>
        <input
          type="number"
          placeholder="Enter Steam ID"
          onChange={handleSteamIDChange} />

      </div>
      {errorMessage && (
        <div className="error-modal">
          <p>{errorMessage} </p>
        </div>
      )}
      <div className="playerCard">
        <img src={playerData?.avatar} />

        <div className="playerCard-info">
          <h3>{playerData?.username}</h3>
          <p>SteamID: {steamid}</p>
          <p>Win Rate: {winRate !== null ? `${winRate.toFixed(2)}%` : "Loading..."}</p>
        </div>
      </div>

      {impactData.length === 0 && <h3>No impact data available</h3>}
      <div className="grid">
        <div>
          <h3>Match History - 5 Games</h3>
          <ul className="matches">
            {matches.map(match => (
              <li
                key={match.matchid}
                onClick={() => setSelectedMatch(match)}
                style={{ cursor: 'pointer', }}>
                <h1 style={{ color: `var(${match.win ? '--greenColor' : '--redColor'})` }}>
                  {match.win ? "Win" : "Loss"}
                </h1>
                <MatchBar matchdata={match} heroid={match.heroId}
                  clickable={false}
                  selected={selectedMatch?.matchid === match.matchid} />
              </li>
            ))}
          </ul>
        </div>
        <div className="graph">
          <div className="graph-header">
            <h3>Impact per minute</h3>
          </div>

          {selectedMatch ? (
            <div className="graph-content">
              <Graph impactData={selectedMatchData} proHeroid={selectedMatch.heroId} />
            </div>
          ) : (
            <div className="graph-placeholder">Select a match to view impact data</div>
          )}
        </div>
      </div>
    </div>
  );
}



//1070668144
export default PersonalPage;
