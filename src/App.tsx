import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './app/store';
import { fetchHeroIconsStart, fetchHeroIconsSuccess, fetchHeroIconsFailure } from './app/heroSlice';
import Main from './pages/Main';
import DatabaseFetch from './app/DatabaseFetch';

function App() {
  DatabaseFetch()
  return (
    <div>
    <Main/>
    </div>
    
  );
};

export default App;
