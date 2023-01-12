import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "../features/auth/authApiSlice";
import usePersist from "../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { toast } from 'react-toastify';

const PersistSignin = () => {
    
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)
    const navigate = useNavigate()

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
            const verifyRefreshToken = async () => {
                try {
                    await refresh()
                    setTrueSuccess(true)
                } catch (err) {
                    console.log(err)
                }
            }

            if (!token && persist) verifyRefreshToken()
        }
        return () => effectRan.current = true
    }, [])

    let content
    if (!persist) {
        content = <Outlet/>
    } else if (isLoading) {
        content = (
            <div className="flex justify-center">
                <p className="txt text-2xl">Loading...</p>
            </div>
        )
    } else if (isError) {
        if (!localStorage.getItem('username')) {
            navigate('/')
            toast.error('Please sign in')
        }
    } else if (isSuccess && trueSuccess) {
        content = <Outlet />
    } else if (token && isUninitialized) {
        content = <Outlet />
    }

    return content
}
export default PersistSignin
