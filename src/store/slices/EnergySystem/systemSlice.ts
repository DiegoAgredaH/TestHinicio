import { createSlice } from "@reduxjs/toolkit";

export interface InitialState {
  energySystem: {
    Energy_System: {
      [prop: string]: {
        [prop: string]: {
          [prop: string]: number | boolean | string | null;
        };
      } | number | boolean | string | null;
    };
  };
}

const initialState: InitialState = {
  energySystem: {
    Energy_System: {},
  },
};

export const energySystemSlice = createSlice({
  name: "energySystem",
  initialState,
  reducers: {
    setEnergySystem: (state, action) => {
      state.energySystem = action.payload.energySystem;
    },
  },
});

export const { setEnergySystem } = energySystemSlice.actions;
