import { error } from "console";
import reducer, { fetchIngredients, ingredientsSlice } from "./ingredientsSlice";
import { TIngredient } from "@utils-types";

const mockIngredients: TIngredient[] = [
    {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 10,
        fat: 10,
        carbohydrates: 10,
        calories: 100,
        price: 100,
        image: '',
        image_large: '',
        image_mobile: ''
    }
];

describe('ingredientsSlice', () => {
    test('должен вернуть initialState для неизвестного экшена', () => {
        expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
            ingredients: [],
            isLoading: false,
            error: null
        });
    });

    test('должен обработать fetchIngredients.pending', () => {
        const state = reducer(
            undefined,
            fetchIngredients.pending('',undefined)
        );

        expect(state).toEqual({
            ingredients: [],
            isLoading: true,
            error: null
        });
    });

    test('должен обработать fetchIngredients.fulfilled', () => {
        const state = reducer(
            undefined,
            fetchIngredients.fulfilled(mockIngredients, '', undefined)
        );

        expect(state).toEqual({
            ingredients: mockIngredients,
            isLoading: false,
            error: null
        });
    });

    test('должен обработать fetchIngredients.rejected', () => {
        const error = new Error('Ошибка');

        const state = reducer(
            undefined,
            fetchIngredients.rejected(error, '', undefined)
        );

        expect(state).toEqual({
            ingredients: [],
            isLoading: false,
            error: 'Ошибка'
        });
    });
});

