import {  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useEffect, useState } from 'react';
import { Legend } from 'recharts';
import { RootState } from "../app/store";
import { HeroImpact } from '../pages/Personalpage';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Graph.css"
const CustomTooltip = ({ active, payload, label, showRandom, heroName }: any) => {
  if (active && payload && payload.length > 0) {
    const yourImpact = payload[0]?.payload || 0;
    const selectedImpact =  payload[1]?.payload || 0;

    if (!selectedImpact) {
      console.error("ERROR", heroName, payload);
      return (
        <div className="custom-tooltip">
          <p>some error occured or no comparison available</p>
        </div>
      );
    }
    const difference = yourImpact.impactPoints - selectedImpact.impactPoints;
    const killsDifference = yourImpact.kills - selectedImpact.kills;
    const goldDifference = yourImpact.gold - selectedImpact.gold;
    const xpDifference = yourImpact.xp - selectedImpact.xp;

    const getDifferenceStyle = (value: number) => ({
      color: value >= 0 ? 'var(--greenColor)' : 'var(--redColor)',
      fontWeight: 'bold',
    });

    return (
      <div className="custom-tooltip">
        <p>Minute: {label}</p>
        <p>Minute: {label}</p>
        {/* Updated Impact Points Display */}
        <p style={getDifferenceStyle(difference)}>
          {`Your Impact Points: ${yourImpact.impactPoints.toFixed(2)} (${difference > 0 ? '+' : ''}${difference.toFixed(2)})`}
        </p>
        <p style={showRandom ? {color: "#82ca9d"} : {color: "#ff7300"}}>

          {`${showRandom ? `Average ${heroName}` :`Random ${heroName} Match`} Impact Points: ${selectedImpact.impactPoints.toFixed(2)}`}
        </p>

        <p style={getDifferenceStyle(killsDifference)}>
          {`Kills: ${killsDifference > 0 ? '+' : ''}${killsDifference.toFixed(2)}`}
        </p>
        <p style={getDifferenceStyle(goldDifference)}>
          {`Gold: ${goldDifference > 0 ? '+' : ''}${goldDifference.toFixed(2)}`}
        </p>
        <p style={getDifferenceStyle(xpDifference)}>
          {`XP: ${xpDifference > 0 ? '+' : ''}${xpDifference.toFixed(2)}`}
        </p>
      </div>
    );
  }
  return null;
};

function Graph ({ impactData, proHeroid} : {impactData: HeroImpact[], proHeroid: number}) {
  const [proImpactData, setProImpactData] = useState<HeroImpact[]>([]);
  const [randomImpactData, setRandomImpactData] = useState<HeroImpact[]>([]);
  const { icons = [], loading, error } = useSelector((state: RootState) => state.heroIcons);
  const navigate = useNavigate();
  const [showRandom, setShowRandom] = useState(false);
  const heroName = icons.find(icon => icon.heroid === proHeroid)?.heroname;
  const formattedData = impactData.map(data => ({
    ...data,
    impactPoints: data.impactPoints /1000
  }));
  
  useEffect(() => {
    const fetchProImpactStats = async() =>{
      try { 
        const response = await fetch(`${process.env.REACT_APP_API_URL}/fetchAvgHeroImpact/${proHeroid}`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        setProImpactData(data); 
      } catch (error) {
        console.error("error fetching pro data", error)
      }
    }
    const fetchRandomMatchImpact = async () => {
      try { 
        const response = await fetch(`${process.env.REACT_APP_API_URL}/fetchRandomMatchImpact/${proHeroid}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setRandomImpactData(data); 
      } catch (error) {
        console.error("Error fetching random match data", error);
      }
    };
    fetchRandomMatchImpact()
    fetchProImpactStats()
  },[proHeroid])

  let formattedProData = proImpactData.map(data => ({
    ...data,
    impactPoints: data.impactPoints / 1000 
  })).slice(0, formattedData.length);
  let randomFormattedProData = randomImpactData.map(data => ({
    ...data,
    impactPoints: data.impactPoints / 1000 
  })).slice(0, formattedData.length);


  const maxImpact = Math.max(
    ...[...formattedData, ...formattedProData, ...randomFormattedProData]
      .map(item => item.impactPoints)
      .filter(value => value !== undefined && value !== null) // Handle possible missing values
  );
  return (
    <div className='graphContainer'>
    <button
          style={{
            marginRight: '8px',
            padding: '4px 8px',
            backgroundColor: !showRandom ? '#82ca9d' : '#ddd',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
          onClick={() => setShowRandom(prev => !prev)}
        >
          Toggle AVG/Random match
        </button>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={formattedData}>
        <XAxis dataKey="minute" allowDuplicatedCategory={false}  label={{ value: "Minute", position: 'insideBottomRight', offset: -5 }}/>
        <YAxis domain={['auto', Math.ceil(maxImpact)]} padding={{ top: 100, bottom: 20 }} label={{ value: "Impact Score", angle: -90, position: 'insideLeft' }}/>
        <Tooltip content={<CustomTooltip showRandom={showRandom} heroName={heroName}/>} /> 
        <Legend verticalAlign="top" height={36} />
        <Line dataKey="impactPoints" stroke="#8884d8" name='Your Impact' />
        <Line data={formattedProData} dataKey="impactPoints" hide={!showRandom}
         stroke="#82ca9d" strokeDasharray="5 5" name={`AVG Impact for ${heroName}`}/> 
        <Line data={randomFormattedProData} dataKey="impactPoints" hide={showRandom}
        stroke="#ff7300" strokeDasharray="3 3" name={`Random match with ${heroName}`} />
      </LineChart>
    </ResponsiveContainer>

   
  </div>
  );
}
export default Graph