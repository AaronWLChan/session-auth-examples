import React, { useEffect, useState } from 'react'
import _axios from '../axios'
import { PageState, User } from '../types'

function AuthOnly() {

    const [user, setUser] = useState<User>()
    const [pageState, setPageState] = useState<PageState>("loading")

    useEffect(() => {

        _axios.get<User>("/api/current_user")
            .then(({ data }) => {

                setUser(data)
                setPageState("success")
            })
            .catch((e) => {
                console.log(e)
                setPageState("error")
            })

    }, [])


    if (pageState === "loading") {
        return <p>Loading...</p>
    }

    if (pageState === "error") {
        return <p>Error!</p>
    }

    return (
    <div>
        <h1>Auth Only!</h1>

        <ul>
            <li>ID: { user?._id }</li>
            <li>Email: { user?.email }</li>
        </ul>

    </div>
    )
}

export default AuthOnly