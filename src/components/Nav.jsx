import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Nav = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isloading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()
    
    const onLogoutClicked = () => {
        sendLogout()
        localStorage.removeItem('username')
        localStorage.removeItem('oneTime')
        localStorage.removeItem('currentUser')
        localStorage.removeItem('currentUserLikedPosts')
        toast.success('You have logged out')
    }

    if (isloading) return <p className='txt text-center'>Logging Out...</p>

    if (isError) return <p className="txt text-center">Error: {error.data?.message}</p>

    return (
        <nav className="bg-zinc-800 border-b mb-10 pb-2 pt-2 border-current txt flex justify-between">
            <ol className="flex">
                <li><Link to={'/home'} className='txt text-2xl ml-6'>Home</Link></li>
                <li><Link to={'/workouts/new'} className='txt text-2xl ml-8'>Create A New Workout</Link></li>
                <li><Link to={'/workouts/new'} className='txt text-2xl ml-8'>My Workouts</Link></li>
            </ol>
            <ol className="flex justify-end mr-6">
                <li><Link to={'/'} className='txt text-2xl ml-8'>Sign In</Link></li>
                <p className="txt text-2xl ml-2">/</p>
                <li><Link to={'/user/new'} className='txt text-2xl ml-2'>Sign Up</Link></li>
                <li><Link to={'/'} className="txt text-2xl ml-2" onClick={onLogoutClicked}>Logout</Link></li>
            </ol>
        </nav>
    )
}

export default Nav