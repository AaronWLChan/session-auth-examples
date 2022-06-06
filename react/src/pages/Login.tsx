import axios from 'axios'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../redux'
import { login } from '../redux/authSlice'

interface Form {
    email: string,
    password: string,
}

function Login() {

    const dispatch = useAppDispatch()

    const { register, handleSubmit, formState: { isValid } } = useForm<Form>({ mode: "onChange" })

    const navigate = useNavigate()

    const onSubmit: SubmitHandler<Form> = (data) => {

        axios.post("/api/login", data)
            .then(() => {

                dispatch(login())
                navigate("/auth-only", { replace: true })
            })
            .catch((e) => {
                console.log(e)
                alert("Login failed. Try again.")
            })

    }

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit(onSubmit)}>

                <label>Email</label>
                <input {...register("email", { required: true })}  type="email" />

                <label>Password</label>
                <input {...register("password", { required: true })} type="password"/>

                <button type='submit' disabled={!isValid} >Login</button>

            </form>

        </div>
    )
}

export default Login