import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { apiUpdateCart, apiClearCart } from "../utils/api";
import { updateProfile } from "./authReducer";

const guestCartKey = 'guest_cart'
const emptyCart = { totalItems: 0, totalPrice: 0, items: {} }

const getGuestCart = () => {
    if (typeof window === 'undefined') return emptyCart
    try {
        const stored = localStorage.getItem(guestCartKey)
        return stored ? JSON.parse(stored) : emptyCart
    } catch {
        return emptyCart
    }
}

const setGuestCart = (cart) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(guestCartKey, JSON.stringify(cart))
    }
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        info: '',
        items: []
    },
    reducers: {
        addItemToCart(state, action) {
            if (action.payload.info === 'ADD')
                toast.success('Item has been added to Cart')
            else if (action.payload.info === 'FAIL')
                toast.info('Item already exists in Cart')
            return { ...state, info: action.payload.info }
        },
        increaseItemQuantity(state, action) {
            return state
        },
        decreaseItemQuantity(state, action) {
            return state
        },
        deleteItemFromCart(state, action) {
            if (action.payload.info === 'DELETE')
                toast.info('Item has been deleted from Cart')
            return { ...state, info: action.payload.info }
        },
        clearCart(state, action) {
            return {...state, info: action.payload.info}
        }
    }
})

export const
    { addItemToCart, increaseItemQuantity, decreaseItemQuantity, deleteItemFromCart, clearCart }
    = cartSlice.actions

export default cartSlice.reducer

const syncCart = async (dispatch, newCart) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
        try {
            await apiUpdateCart(newCart)
        } catch {
            setGuestCart(newCart)
        }
    } else {
        setGuestCart(newCart)
    }
    dispatch(updateProfile({ cart: newCart }))
}

export const addToCart = (productId, productPrice, colorName, colorValue, cart) => {
    return async (dispatch) => {
        const items = cart.items || {}
        if (Object.keys(items).includes(productId)) {
            dispatch(addItemToCart({ info: 'FAIL' }))
            return
        }
        const newCart = {
            totalItems: Number(cart.totalItems) + 1,
            totalPrice: Number(cart.totalPrice) + Number(productPrice),
            items: {
                ...items,
                [productId]: {
                    quantity: 1,
                    color: { name: colorName, value: colorValue }
                }
            }
        }
        await syncCart(dispatch, newCart)
        dispatch(addItemToCart({ info: 'ADD' }))
    }
}

export const increaseQuantity = (productId, productPrice, cart) => {
    const items = { ...cart.items }
    items[productId] = { ...items[productId], quantity: items[productId].quantity + 1 }
    return async (dispatch) => {
        const newCart = {
            totalItems: Number(cart.totalItems) + 1,
            totalPrice: Number(cart.totalPrice) + Number(productPrice),
            items
        }
        await syncCart(dispatch, newCart)
        dispatch(increaseItemQuantity())
    }
}

export const decreaseQuantity = (productId, productPrice, cart) => {
    const items = { ...cart.items }
    items[productId] = { ...items[productId], quantity: items[productId].quantity - 1 }
    return async (dispatch) => {
        const newCart = {
            totalItems: Number(cart.totalItems) - 1,
            totalPrice: Number(cart.totalPrice) - Number(productPrice),
            items
        }
        await syncCart(dispatch, newCart)
        dispatch(decreaseItemQuantity())
    }
}

export const deleteFromCart = (productId, productPrice, quantity, cart) => {
    return async (dispatch) => {
        const items = { ...cart.items }
        delete items[productId]
        const newCart = {
            totalItems: Number(cart.totalItems) - Number(quantity),
            totalPrice: Number(cart.totalPrice) - (Number(productPrice) * Number(quantity)),
            items
        }
        await syncCart(dispatch, newCart)
        dispatch(deleteItemFromCart({ info: 'DELETE' }))
    }
}

export const deleteCart = () => {
    return async (dispatch) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (token) {
            try {
                await apiClearCart()
            } catch {
                // ignore API failures and fall back to local storage
            }
        }
        const emptyCart = { totalItems: 0, totalPrice: 0, items: {} }
        setGuestCart(emptyCart)
        dispatch(updateProfile({ cart: emptyCart }))
        dispatch(clearCart({ info: 'CLEAR' }))
    }
}