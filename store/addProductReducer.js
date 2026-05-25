import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { apiAddProduct } from '../utils/api'

const dataState = {
    isLoading: true,
    isFetching: false,
    isLoaded: false,
    error: null,
    data: null
}

export const addProductSlice = createSlice({
    name: 'addProducts',
    initialState: dataState,
    reducers: {
        addProduct(state, action) {
            toast.success('Product has been added to database')
            return action.payload
        }
    }
})

export const { addProduct } = addProductSlice.actions

export default addProductSlice.reducer

export const addNewProduct = (product, changeLoadState) => {
    return async (dispatch) => {
        try {
            const formData = new FormData()
            formData.append('productName', product.productName)
            formData.append('productPrice', product.productPrice)
            formData.append('category', product.category)
            formData.append('subcategory', JSON.stringify(product.subcategory))
            formData.append('color', JSON.stringify(product.color))
            formData.append('colorValue', JSON.stringify(product.colorValue))
            formData.append('width', product.width)
            formData.append('length', product.length)
            formData.append('height', product.height)
            formData.append('desc', product.desc)

            product.images.forEach((img) => {
                if (img) formData.append('images', img)
            })

            const result = await apiAddProduct(formData)
            dispatch(addProduct({
                ...dataState,
                isLoading: false,
                isLoaded: true,
                data: result.pid
            }))
            changeLoadState()
        } catch (e) {
            dispatch(addProduct({
                ...dataState,
                isLoading: false,
                isLoaded: true,
                error: e.message
            }))
        }
    }
}