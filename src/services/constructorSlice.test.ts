import reducer, {
    addConstructorIngredient,
    removeConstructorIngredient,
    moveConstructorIngredient,
    clearConstructor
} from "./constructorSlice";

import { TIngredient } from "@utils-types";
import { ingredientsSlice } from "./ingredientsSlice";

const bun: TIngredient = {
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
};

const main: TIngredient = {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 200,
    price: 200,
    image: '',
    image_large: '',
    image_mobile: ''
};

describe('constructorSlice', () => {
    test('должен вернуть initialState для неизвестного экшена', () => {
        expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
            bun: null,
            ingredients: []
        });
    });

    test('должен добавить булку', () => {
        const state = reducer(
            undefined,
            addConstructorIngredient(bun)
        );

        expect(state.bun?._id).toBe('1');
        expect(state.ingredients).toHaveLength(0);
    });

    test('должен удалить ингредиент', () => {
        let state = reducer(
            undefined,
            addConstructorIngredient(main)
        );

        const id = state.ingredients[0].id;

        state = reducer(
            state,
            removeConstructorIngredient(id)
        );

        expect(state.ingredients).toHaveLength(0);
    });

    test('должен переместить ингредиенты', () => {
        let state = reducer(
            undefined,
            addConstructorIngredient(main)
        );

        state = reducer(
            state,
            addConstructorIngredient({
                ...main,
                _id: '3',
                name: 'Сыр'
            })
        );

        const firstName = state.ingredients[0].name;
        const secondName = state.ingredients[1].name;

        state = reducer(
            state,
            moveConstructorIngredient({
                from: 0,
                to: 1
            })
        );

        expect(state.ingredients[0].name).toBe(secondName);
        expect(state.ingredients[1].name).toBe(firstName);
    });

    test('должен очистить конструктор', () => {
        let state = reducer(
            undefined,
            addConstructorIngredient(bun)
        );

        state = reducer(
            state,
            addConstructorIngredient(main)
        );

        state = reducer(
            state,
            clearConstructor()
        );

        expect(state).toEqual({
            bun: null,
            ingredients: []
        });
    });
});