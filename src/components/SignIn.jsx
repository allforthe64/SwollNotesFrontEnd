//function imports
import { useState, useRef, useEffect} from "react"
import { useNavigate } from "react-router-dom"

import { useDispatch } from 'react-redux'
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";
import usePersist from "../hooks/usePersist";

//toast import
import { toast } from 'react-toastify';
import FormInput from "./FormInput";

const SignIn = () => {

    //navigate and dispatch hooks
    const navigate = useNavigate()
    const dispatch = useDispatch()

    //initialize reffs
    const userRef = useRef()
    const errRef = useRef()

    //initialize state to hold user information
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()

    //define on change functions
    const handleChangeU = (event) => {
        setUsername(event.target.value)
    }
    const handleChangeP = (event) => {
        setPassword(event.target.value)
    }

    //handle submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            //validate data

            const { accessToken } = await login({ username, password}).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')
            localStorage.setItem('username', username)
            localStorage.setItem('currentUserLikedPosts', [])
            if (persist === false) localStorage.setItem('oneTime', true)

            navigate('/home')
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response')
                toast.error('No Server Response')
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password')
                toast.error('Please fill out the username and password fields')
            } else if (err.status === 401) {
                setErrMsg('Unauthorized, have you made an account yet?')
                toast.error('Unauthorized, have you made an account yet?')
            } else {
                setErrMsg(err.data?.message)
                toast.err(errMsg)
            }
        }
    }

    //set persist
    const handleToggle = () => setPersist(prev => !prev)

    //clear out any err messages
    useEffect(() => {setErrMsg('')}, [username, password])

    //login
    const [login, { isLoading }] = useLoginMutation()

    //define err class
    const errClass = errMsg ? 'errmsg': 'offscreen'

    if (isLoading) return (
        <div className="flex justify-center">
            <p className="txt text-2xl">Loading...</p>
        </div>
    )

    return (
        <>
            <h1 className="txt text-5xl text-center mb-4">Sign In:</h1>
            <div className="mb-10">
                <FormInput Change={handleChangeU} placeHolder='Enter your username' inputType='text' center={true} autoComplete='off' required/>
                <FormInput Change={handleChangeP} placeHolder='Enter your Password' inputType='password' center={true} autoComplete='off' required/>
            </div>
            <div className="w-9/12 ml-[20%] mb-10">
               <label htmlFor="persist" className="txt text-lg leading-tight">
                Remember Me:
                    <input 
                        type="Checkbox"
                        id="persist"
                        className="toggler ml-2"
                        onChange={handleToggle}
                        checked={persist}
                    />
                </label> 
            </div>
            <div className="w-6/12 ml-[25%] mb-20">
                <button className="txt border border-current w-3/6 ml-[25%] text-3xl" onClick={handleSubmit}>Sign In</button>
            </div>
        </>
    )
}

export default SignIn