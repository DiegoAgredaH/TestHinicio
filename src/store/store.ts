import { configureStore } from "@reduxjs/toolkit";
import { energySystemSlice } from "./slices/EnergySystem/systemSlice";

export const store = configureStore({
    reducer:{
    energySystem: energySystemSlice.reducer    
    }
})

// Exporta el tipo RootState
export type RootState = ReturnType<typeof store.getState>;

// Exporta el tipo AppDispatch
export type AppDispatch = typeof store.dispatch;