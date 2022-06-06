import React from 'react'
import { Link } from 'react-router-dom'
import _axios from '../axios'
import { useAppDispatch, useAppSelector } from '../redux'
import { logout } from '../redux/authSlice'

function Header() {

  const dispatch = useAppDispatch()
  const loggedIn = useAppSelector((state) => state.auth.loggedIn)

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

  return (
    <div>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>

            {
                loggedIn ?
                <>
                    <li>
                        <Link to="/auth-only">Auth Only</Link>
                    </li>

                    <li>
                        <button onClick={() => signOut()} >Logout</button>
                    </li>

                </>

                :
                <>
                    <li>
                    <Link to="/login">Login</Link>
                    </li>
                </>

            }

        </ul>
    </div>
  )
}

export default Header