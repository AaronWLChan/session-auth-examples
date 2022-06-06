import React from 'react'
import { useAppSelector } from '../redux'

function Home() {

  const loggedIn = useAppSelector((state) => state.auth.loggedIn)

  return (
    <div>
        <h1>Home!</h1>

        {
            loggedIn &&
            <p>Logged In!</p>
        }

    </div>
  )
}

export default Home