import axios from 'axios'
import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import { useAppDispatch } from './redux'
import { login, logout } from './redux/authSlice'
import Routes from './Routes'
import { PageState } from './types'

function App() {

  const [pageState, setPageState] = useState<PageState>("loading")
  const dispatch = useAppDispatch()

  useEffect(() => {

    const handleLogout = (e: StorageEvent) => {
      if (e.key === "logout"){
        dispatch(logout())
      }
    }

    window.addEventListener("storage", handleLogout)

    return () => window.removeEventListener("storage", handleLogout)

  }, [])

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

  if (pageState === "loading"){
    return null
  }

  return (
    <div className="App">
      <Layout>
        <Routes/>
      </Layout>
    </div>
  )
}

export default App
