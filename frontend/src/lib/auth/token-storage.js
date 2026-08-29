/**
 * The only place the admin token is read or written. Keeping it out of the
 * HTTP layer means switching to sessionStorage or cookies touches this file only.
 */
const TOKEN_KEY = 'hh_admin_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)

export const clearToken = () => localStorage.removeItem(TOKEN_KEY)
