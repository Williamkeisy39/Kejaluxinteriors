import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'
import persistReducer from 'redux-persist/lib/persistReducer';
import persistStore from 'redux-persist/lib/persistStore';

import authReducer from './authReducer';
import productsReducer from './productsReducer';
import productReducer from './productReducer';
import cartReducer from './cartReducer';
import wishlistReducer from './wishlistReducer';
import orderReducer from './orderReducer';
import addProductReducer from './addProductReducer';
import searchReducer from './searchReducer';

const persistAuthConfig = {
    key: 'auth',
    storage,
    whitelist: ['uid', 'email', 'displayName', 'isEmpty', 'isLoaded', 'profile']
}

const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer)

const combinedReducers = combineReducers({
    auth: persistedAuthReducer,
    products: productsReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    addProduct: addProductReducer,
    wishlist: wishlistReducer,
    search: searchReducer
})

const rootReducer = (state, action) => {
    if (action.type === 'auth/clearUser') {
        storage.removeItem('persist:auth')
        state = undefined
    }
    return combinedReducers(state, action)
}

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
})

export const persistor = persistStore(store)