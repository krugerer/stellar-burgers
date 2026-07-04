import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export const selectBuns = createSelector(
  [
    (state: { ingredients: TIngredientsState }) => state.ingredients.ingredients
  ],
  (ingredients) => ingredients.filter((item) => item.type === 'bun')
);

export const selectMains = createSelector(
  [
    (state: { ingredients: TIngredientsState }) => state.ingredients.ingredients
  ],
  (ingredients) => ingredients.filter((item) => item.type === 'main')
);

export const selectSauces = createSelector(
  [
    (state: { ingredients: TIngredientsState }) => state.ingredients.ingredients
  ],
  (ingredients) => ingredients.filter((item) => item.type === 'sauce')
);

export default ingredientsSlice.reducer;
