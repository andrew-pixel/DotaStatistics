import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchItemIconsStart, fetchItemIconsSuccess, fetchItemIconsFailure } from "./itemSlice"
import  { fetchHeroIconsStart, fetchHeroIconsSuccess, fetchHeroIconsFailure } from "./heroSlice"
function DatabaseFetch() {
  const dispatch = useDispatch() // Access the setter from the context

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchHeroIconsStart());
      dispatch(fetchItemIconsStart());
      try {

        const heroes = await fetch(`${process.env.REACT_APP_API_URL}/fetchHeroTable`);
        if (!heroes.ok) {
          throw new Error("Failed to fetch heroes");
        }
        const items = await fetch(`${process.env.REACT_APP_API_URL}/fetchItemTable`);
        if (!items.ok) {
          throw new Error("Failed to fetch items");
        }
        const itemsdata = await items.json();
        const heroesdata = await heroes.json();

        dispatch(fetchHeroIconsSuccess(heroesdata));
        dispatch(fetchItemIconsSuccess(itemsdata));
      } catch (error) {
        console.error("Error fetching icons:", error);
        dispatch(fetchHeroIconsFailure("error"));
        dispatch(fetchItemIconsFailure("error"));
      }
    };

    fetchData();
  }, [dispatch]);

};

export default DatabaseFetch;