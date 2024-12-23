import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ItemIcon {
  itemid: number;
  name: string;
  url: string;
}

interface ItemIconsState {
  icons: ItemIcon[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemIconsState = {
  icons: [],
  loading: false,
  error: null,
};

const itemIconsSlice = createSlice({
  name: 'itemIcons',
  initialState,
  reducers: {
    fetchItemIconsStart: (state) => {
      state.loading = true;
    },
    fetchItemIconsSuccess: (state, action: PayloadAction<ItemIcon[]>) => {
      state.loading = false;
      state.icons = action.payload;
      state.error = null;
    },
    fetchItemIconsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchItemIconsStart, fetchItemIconsSuccess, fetchItemIconsFailure } = itemIconsSlice.actions;
export default itemIconsSlice.reducer;