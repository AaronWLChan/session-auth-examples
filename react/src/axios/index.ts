import axios, { AxiosError } from "axios";
import { Store } from "../redux";
import { logout } from "../redux/authSlice";

let store: Store

export const injectStore = (_store: Store) => {
    store = _store
}

// To send cookie --> backend
const _axios = axios.create({ withCredentials: true })

_axios.interceptors.response.use((response) => response,
     (error: AxiosError) => {

        //If backend responds with 403, redirect to login page if on an authorized page
        if (error.response && error.response.status === 401) {
            store.dispatch(logout())
        }

        return Promise.reject(error)
})

export default _axios