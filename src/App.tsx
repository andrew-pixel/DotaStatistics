import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './app/store';
import { fetchHeroIconsStart, fetchHeroIconsSuccess, fetchHeroIconsFailure } from './app/heroSlice';
import Main from './pages/Main';
import DatabaseFetch from './app/DatabaseFetch';
import ImpactStats from './pages/ProData';
import ComputeStats from './app/statsSlice';
function App() {
  DatabaseFetch()
  return (
    <div>
    <ImpactStats/>
    <Main/>
    </div>
    
  );
};

export default App;
