import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import { apiGetOrders, apiCreateOrder, apiGetAllOrders, apiUpdateOrderStatus } from "../utils/api"

const dataState = {
    isLoading: true,
    isFetching: false,
    isLoaded: false,
    error: null,
    data: []
}

const orderSlice = createSlice({
    name: 'orders',
    initialState: dataState,
    reducers: {
        fetchOrders(state, action) {
            return action.payload
        },
        createOrder(state, action) {
            return action.payload
        },
        updateStatus(state, action) {
            toast.info(action.payload)
            return
        }
    }
})

export const { fetchOrders, createOrder, updateStatus } = orderSlice.actions

export default orderSlice.reducer

export const retrieveOrders = () => {
    return async (dispatch) => {
        dispatch(fetchOrders({ ...dataState, isFetching: true }))
        try {
            const orders = await apiGetOrders()
            dispatch(fetchOrders({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                data: orders
            }))
        } catch (e) {
            dispatch(fetchOrders({
                ...dataState,
                isLoading: false,
                isFetching: false,
                error: e.message,
                data: []
            }))
        }
    }
}

export const addOrder = (userInfo, totalPrice, items) => {
    return async (dispatch) => {
        dispatch(createOrder({ ...dataState, isFetching: true }))
        try {
            const order = await apiCreateOrder({
                totalPrice,
                phone: userInfo.phone,
                email: userInfo.email,
                fullname: userInfo.fullname,
                state: userInfo.state,
                city: userInfo.city,
                items
            })
            dispatch(createOrder({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                data: order
            }))
        } catch (e) {
            dispatch(createOrder({
                ...dataState,
                isLoading: false,
                isFetching: false,
                error: e.message,
                data: {}
            }))
        }
    }
}

export const retrieveAllOrders = () => {
    return async (dispatch) => {
        dispatch(fetchOrders({ ...dataState, isFetching: true }))
        try {
            const orders = await apiGetAllOrders()
            dispatch(fetchOrders({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                data: orders
            }))
        } catch (e) {
            dispatch(fetchOrders({
                ...dataState,
                isLoading: false,
                isFetching: false,
                isLoaded: true,
                data: [],
                error: e.message
            }))
        }
    }
}

export const updateOrderStatus = (uid, oid, status) => {
    return async (dispatch) => {
        try {
            await apiUpdateOrderStatus(oid, status)
            dispatch(updateStatus('Order status has been updated'))
        } catch (e) {
            dispatch(updateStatus('Order status failed to update'))
        }
    }
}