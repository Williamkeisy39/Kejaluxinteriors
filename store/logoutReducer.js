// This file is kept for backwards compatibility.
// Logout is now handled via authReducer.
import { logoutUser } from './authReducer';

export const signOut = logoutUser;

export default function logoutReducer(state = { isLoggedOut: false }) {
    return state;
}