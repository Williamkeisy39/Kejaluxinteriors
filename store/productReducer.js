import { createSlice } from "@reduxjs/toolkit";
import { apiGetProduct } from "../utils/api";

const dataState = {
    isLoading: true,
    isFetching: false,
    isLoaded: false,
    error: null,
    data: {}
}

export const productSlice = createSlice({
    name: 'product',
    initialState: dataState,
    reducers: {
        fetchProduct(state, action) {
            return action.payload
        }
    }
})

export const { fetchProduct } = productSlice.actions

export default productSlice.reducer

export const getProduct = (productId) => {
    return async (dispatch) => {
        dispatch(fetchProduct({
            ...dataState, isFetching: true
        }))
        try {
            const product = await apiGetProduct(productId)
            dispatch(fetchProduct({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                data: product
            }))
        } catch (e) {
            dispatch(fetchProduct({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                error: e.message,
                data: null
            }))
        }
    }
}