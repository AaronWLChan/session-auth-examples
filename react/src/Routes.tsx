import React from 'react'
import { Routes as ReactRoutes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import AuthOnly from './pages/AuthOnly';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function Routes() {
  return (
    <ReactRoutes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/auth-only' element={<ProtectedRoute redirectTo='/login' />}>
            <Route path='/auth-only' element={<AuthOnly/>} />
        </Route>
        <Route path='*' element={<NotFound/>} />
    </ReactRoutes>
  )
}

export default Routes