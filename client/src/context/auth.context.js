import {createContext} from 'react'

// пустая функция
function noop() {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    roleId: null,
    username: null,
    login: noop,
    logout: noop,
    isAuthenticated: false
});