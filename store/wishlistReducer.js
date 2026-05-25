import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { apiUpdateWishlist } from "../utils/api";
import { updateProfile } from "./authReducer";

const guestWishlistKey = 'guest_wishlist'

const getGuestWishlist = () => {
    if (typeof window === 'undefined') return []
    try {
        const stored = localStorage.getItem(guestWishlistKey)
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

const setGuestWishlist = (wishlist) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(guestWishlistKey, JSON.stringify(wishlist))
    }
}

const syncWishlist = async (dispatch, newWishlist) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
        try {
            await apiUpdateWishlist(newWishlist)
        } catch {
            setGuestWishlist(newWishlist)
        }
    } else {
        setGuestWishlist(newWishlist)
    }
    return newWishlist
}

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        info: '',
        wishlist: []
    },
    reducers: {
        addItemToWishlist(state, action) {
            if (action.payload.info === 'ADD')
                toast.success('Item has been added to wishlist')
            else if (action.payload.info === 'FAIL')
                toast.info('Item already exists in wishlist')
            return {
                info: action.payload.info,
                wishlist: action.payload.items
            }
        },
        removeItemFromWishlist(state, action) {
            if (action.payload.info === 'DELETE')
                toast.info('Item has been removed from wishlist')
            return {
                info: action.payload.info,
                wishlist: action.payload.items
            }
        }
    }
})

export const { addItemToWishlist, removeItemFromWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer

export const addToWishlist = (productId, wishlist) => {
    return async (dispatch) => {
        if (wishlist.includes(productId)) {
            dispatch(addItemToWishlist({ info: 'FAIL', items: wishlist }))
            return
        }
        const newWishlist = [...wishlist, productId]
        await syncWishlist(dispatch, newWishlist)
        dispatch(updateProfile({ wishlist: newWishlist }))
        dispatch(addItemToWishlist({ info: 'ADD', items: newWishlist }))
    }
}

export const deleteFromWishlist = (productId, wishlist) => {
    return async (dispatch) => {
        const newWishlist = wishlist.filter(id => id !== productId)
        await syncWishlist(dispatch, newWishlist)
        dispatch(updateProfile({ wishlist: newWishlist }))
        dispatch(removeItemFromWishlist({ info: 'DELETE', items: newWishlist }))
    }
}