import { createSlice } from "@reduxjs/toolkit";

export interface InitialState {
  energySystem: {
    Energy_System: {
      list_of_elements?:{
        [prop: string]: 
        | number 
        | boolean 
        | string 
        | null
      }
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
