# React
This project was created with Vite.

Libraries used:
* Axios
* react-redux
* @redux-js/toolkit
* react-hook-form
* react-router-dom@6

## How do I handle page reload?
Add a `useEffect` to trigger on `App` mount. Call the `validate_session` endpoint with `withCredential: true` to pass along an existing session.
```typescript
//App.tsx
  useEffect(() => {
    axios.post<{ session: boolean }>("/api/validate_session", undefined, { withCredentials: true })
      .then(({ data }) => {
        if (data.session === true) dispatch(login())
      })
      .catch((e) => {
        console.log(e)
      })
      .finally(() => {
        setPageState("success")
      })
  }, [])
```


## How do I handle authorized routes?
When using `react-router-dom` you can create a protected route component as seen below:
```typescript
// ProtectedRoute.tsx
import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from '../redux'

interface ProtectedRouteProps {
  redirectTo?: string
}

function ProtectedRoute({ redirectTo }: ProtectedRouteProps) {

  const loggedIn = useAppSelector((state) => state.auth.loggedIn)

  return (
    loggedIn ? <Outlet/> : <Navigate to={redirectTo ? redirectTo : "/"} replace />
  )
}

export default ProtectedRoute
```

You can then use the component as an element when defining routes.
```typescript
// Routes.tsx
<Routes>
    <Route path="/auth-only" element={<ProtectedRoute redirectTo="/login" />} >
        <Route path="/auth-only" element={<AuthOnly/>} />
    </Route>
    // ... Other routes
<Routes>
```

## How do I make authenticated requests?
Create a new `axios` instance that intercepts requests. Use this `axios` instance whenever you need to make an authenticated request.
```typescript
const _axios = axios.create({ withCredentials: true })
```

## How do I trigger logout when a session expires?
When a session is expired, the backend will respond with a `401 - Unauthorized` response. To catch this response you need to implement a `interceptor`.
```typescript
_axios.interceptors.response.use((response) => response,
     (error: AxiosError) => {

        //If backend responds with 401, protected routes will redirect to login page
        if (error.response && error.response.status === 401) {
            store.dispatch(logout())
        }

        return Promise.reject(error)
})
```

Note: To access `redux` store in the interceptor you will need to inject the store in your project's entry point file - Main.tsx (Vite).
```typescript
// axios/index.ts
let store: Store

export const injectStore = (_store: Store) => {
    store = _store
}

// Main.tsx
import { store } from './redux'
injectStore(store)
```

## How do I handle logout?
To clear the session cookie, you will need send a request to the backend through the `logout` endpoint then dispatch a `logout` event to Redux.
```typescript
// Header.tsx
  const signOut = () => {
    _axios.post("/api/logout", undefined)
        .then(() => {
            dispatch(logout())
            localStorage.setItem("logout", "1")
        })
        .catch((e) => {
            console.log(e)
            alert("Failed to log out")
        })
  }
```
### Log out all tabs
To logout out of all tabs you will need to implement an event listener which listens to changes in `LocalStorage`.
```typescript
// App.tsx
  useEffect(() => {
    const handleLogout = (e: StorageEvent) => {
      if (e.key === "logout"){
        dispatch(logout())
      }
    }

    window.addEventListener("storage", handleLogout)

    return () => window.removeEventListener("storage", handleLogout)

  }, [])
```