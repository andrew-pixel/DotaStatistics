import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HeroIcon {
  heroid:  number;
  heroname: string;
  url: string;
}

interface HeroIconsState {
  icons: HeroIcon[];
  loading: boolean;
  error: string | null;
}

const initialState: HeroIconsState = {
  icons: [],
  loading: false,
  error: null,
};

const heroIconsSlice = createSlice({
  name: 'heroIcons',
  initialState,
  reducers: {
    fetchHeroIconsStart: (state) => {
      state.loading = true;
    },
    fetchHeroIconsSuccess: (state, action: PayloadAction<HeroIcon[]>) => {
      state.loading = false;
      state.icons = action.payload;
      state.error = null;
    },
    fetchHeroIconsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchHeroIconsStart, fetchHeroIconsSuccess, fetchHeroIconsFailure } = heroIconsSlice.actions;
export default heroIconsSlice.reducer;