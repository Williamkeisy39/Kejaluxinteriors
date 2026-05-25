import { createSlice } from '@reduxjs/toolkit';
import { apiLogin, apiSignup, apiGetMe, apiOAuthLogin } from '../utils/api';

const guestCartKey = 'guest_cart';
const guestWishlistKey = 'guest_wishlist';

const getGuestCart = () => {
    if (typeof window === 'undefined') return { totalItems: 0, totalPrice: 0, items: {} };
    try {
        const stored = localStorage.getItem(guestCartKey);
        return stored ? JSON.parse(stored) : { totalItems: 0, totalPrice: 0, items: {} };
    } catch {
        return { totalItems: 0, totalPrice: 0, items: {} };
    }
};

const getGuestWishlist = () => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(guestWishlistKey);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const setGuestCart = (cart) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(guestCartKey, JSON.stringify(cart));
    }
};

const setGuestWishlist = (wishlist) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(guestWishlistKey, JSON.stringify(wishlist));
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        uid: null,
        email: null,
        displayName: null,
        isEmpty: true,
        isLoaded: false,
        profile: {
            cart: { totalItems: 0, totalPrice: 0, items: {} },
            wishlist: [],
            displayName: null,
            email: null,
            isEmpty: true
        }
    },
    reducers: {
        setUser(state, action) {
            const u = action.payload;
            state.uid = u.uid;
            state.email = u.email;
            state.displayName = u.displayName;
            state.isEmpty = false;
            state.isLoaded = true;
            state.profile = {
                cart: u.cart || { totalItems: 0, totalPrice: 0, items: {} },
                wishlist: u.wishlist || [],
                displayName: u.displayName,
                email: u.email,
                isEmpty: false
            };
        },
        updateProfile(state, action) {
            state.profile = { ...state.profile, ...action.payload };
        },
        clearUser(state) {
            state.uid = null;
            state.email = null;
            state.displayName = null;
            state.isEmpty = true;
            state.isLoaded = true;
            state.profile = {
                cart: { totalItems: 0, totalPrice: 0, items: {} },
                wishlist: [],
                displayName: null,
                email: null,
                isEmpty: true
            };
        }
    }
});

export const { setUser, updateProfile, clearUser } = authSlice.actions;
export default authSlice.reducer;

export const loginUser = (email, password) => {
    return async (dispatch) => {
        const data = await apiLogin(email, password);
        localStorage.setItem('token', data.token);
        dispatch(setUser(data.user));
        return data;
    };
};

export const signupUser = (fullname, email, password) => {
    return async (dispatch) => {
        const data = await apiSignup(fullname, email, password);
        localStorage.setItem('token', data.token);
        dispatch(setUser(data.user));
        return data;
    };
};

export const fetchMe = () => {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                const guestCart = getGuestCart();
                const guestWishlist = getGuestWishlist();
                dispatch(clearUser());
                dispatch(updateProfile({ cart: guestCart, wishlist: guestWishlist }));
                return;
            }
            const user = await apiGetMe();
            dispatch(setUser(user));
        } catch {
            localStorage.removeItem('token');
            const guestCart = getGuestCart();
            const guestWishlist = getGuestWishlist();
            dispatch(clearUser());
            dispatch(updateProfile({ cart: guestCart, wishlist: guestWishlist }));
        }
    };
};

export const logoutUser = () => {
    return (dispatch, getState) => {
        const currentCart = getState().auth.profile.cart;
        const currentWishlist = getState().auth.profile.wishlist;
        setGuestCart(currentCart || { totalItems: 0, totalPrice: 0, items: {} });
        setGuestWishlist(currentWishlist || []);
        localStorage.removeItem('token');
        localStorage.removeItem('PRODUCT_REF');
        dispatch(clearUser());
        dispatch(updateProfile({ cart: getGuestCart(), wishlist: getGuestWishlist() }));
    };
};

export const oauthLogin = (provider, email, fullname, providerId) => {
    return async (dispatch) => {
        const data = await apiOAuthLogin(provider, email, fullname, providerId);
        localStorage.setItem('token', data.token);
        dispatch(setUser(data.user));
        return data;
    };
};
