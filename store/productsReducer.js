import { createSlice } from "@reduxjs/toolkit";
import { apiGetProducts } from "../utils/api";

const dataState = {
    isLoading: true,
    isFetching: false,
    isLoaded: false,
    error: null,
    data: {},
    page: 1,
    endOfData: false
}

export const productSlice = createSlice({
    name: 'products',
    initialState: dataState,
    reducers: {
        fetchProducts(state, action) {
            return action.payload
        },
        filterProductsByPrice(state, action) {
            return action.payload
        },
        filterProductsBySubCategory(state, action) {
            return action.payload
        }
    }
})

export const { fetchProducts, filterProductsByPrice, filterProductsBySubCategory }
    = productSlice.actions

export default productSlice.reducer

export const getAllProducts = (page, prevData = {}) => {
    return async (dispatch) => {
        dispatch(fetchProducts({
            ...dataState, isFetching: true
        }))
        try {
            const res = await apiGetProducts({ page: page || 1, limit: 20 })
            const result = {}
            res.products.forEach((p) => { result[p.pid] = p })
            const mergedData = Object.keys(prevData).length ? { ...prevData, ...result } : result
            dispatch(fetchProducts({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                data: mergedData,
                page: res.page,
                endOfData: res.endOfData
            }))
        } catch (e) {
            dispatch(fetchProducts({
                ...dataState,
                isLoading: false,
                isFetching: false,
                error: e.message,
                data: null
            }))
        }
    }
}

export const getProducts = (path, prevData, page) => {
    return async (dispatch) => {
        dispatch(fetchProducts({
            ...dataState, isFetching: true
        }))
        try {
            const res = await apiGetProducts({ category: path, page: page || 1, limit: 20 })
            const result = {}
            res.products.forEach((p) => { result[p.pid] = p })
            dispatch(fetchProducts({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                data: { ...prevData, ...result },
                page: res.page,
                endOfData: res.endOfData
            }))
        } catch (e) {
            dispatch(fetchProducts({
                ...dataState,
                isLoading: false,
                isFetching: false,
                error: e.message,
                data: null
            }))
        }
    }
}

export const getProductsByColor = (path, color, page) => {
    return async (dispatch) => {
        dispatch(fetchProducts({
            ...dataState, isFetching: true
        }))
        try {
            const params = { color, page: page || 1, limit: 20 }
            if (path) params.category = path
            const res = await apiGetProducts(params)
            const result = {}
            res.products.forEach((p) => { result[p.pid] = p })
            dispatch(fetchProducts({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                data: result,
                page: res.page,
                endOfData: res.endOfData
            }))
        } catch (e) {
            dispatch(fetchProducts({
                ...dataState,
                isLoading: false,
                isFetching: false,
                error: e.message,
                data: null
            }))
        }
    }
}

export const getProductsByPrice = (path, minPrice, maxPrice, page) => {
    return async (dispatch) => {
        dispatch(fetchProducts({
            ...dataState, isFetching: true
        }))
        try {
            const params = { minPrice, maxPrice, page: page || 1, limit: 20 }
            if (path) params.category = path
            const res = await apiGetProducts(params)
            const result = {}
            res.products.forEach((p) => { result[p.pid] = p })
            dispatch(fetchProducts({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                data: result,
                page: res.page,
                endOfData: res.endOfData
            }))
        } catch (e) {
            dispatch(fetchProducts({
                ...dataState,
                isLoading: false,
                isFetching: false,
                error: e.message,
                data: null
            }))
        }
    }
}

export const getProductsBySubCategory = (subCategory) => {
    return async (dispatch) => {
        dispatch(filterProductsBySubCategory({
            ...dataState, isFetching: true
        }))
        try {
            const res = await apiGetProducts({ subcategory: subCategory, limit: 20 })
            const result = {}
            res.products.forEach((p) => { result[p.pid] = p })
            dispatch(filterProductsBySubCategory({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                data: result,
                endOfData: res.endOfData
            }))
        } catch (e) {
            dispatch(filterProductsBySubCategory({
                ...dataState,
                isLoading: false,
                isFetching: false,
                error: e.message,
                data: null
            }))
        }
    }
}