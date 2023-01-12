//function imports
import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom"

//toast import
import { toast } from 'react-toastify';
import FormInput from "../../components/FormInput";

const NewUser = () => {

    //define navigate variable
    const navigate = useNavigate()

    //define variable to hold redux query
    const [addNewUser,
        isLoading,
        isSucces,
        isError,
        error
    ] = useAddNewUserMutation()

    //initialize state to hold user information
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [pConf, setPConf] = useState('')

    //define on change functions
    const handleChangeU = (event) => {
        setUsername(event.target.value)
    }
    const handleChangeP = (event) => {
        setPassword(event.target.value)
    }
    const handleChangePConf = (event) => {
        setPConf(event.target.value)
    }

    //valide input data
    const createUser = async (e) => {

        e.preventDefault()

        //validate inputs
        //make sure username isn't too long
        if (username.length > 40 || username.length === 0) {
            toast.error('Please enter a username between 1 and 40 characters!')
        }
        //make sure username doesn't have spaces
        else if (username.includes(' ')) {
            toast.error('No spaces are allowed in usernames!')
        }
        //make sure password is of correct length
        else if (password.length > 20 || password.length < 6) {
            toast.error('Please enter a password between 6 and 20 characters!')
        }
        //make sure password doesn't have spaces
        else if (password.includes(' ')) {
            toast.error('No spaces are allowed in passwords!')
        }
        //make sure that the password and pConf match
        else if (password !== pConf) {
            toast.error('Password and confirmation do not match!')
        } else { 
            await addNewUser({username, password})
            navigate('/')
        }

    }


    return (
        <>
            <h1 className="txt text-5xl text-center mb-4">New User:</h1>
            <div className="w-3/5 ml-[20%] mb-16">
                <FormInput Change={handleChangeU} placeHolder='Enter a username' inputType='text'/>
                <FormInput Change={handleChangeP} placeHolder='Enter a Password' inputType='password'/>
                <FormInput Change={handleChangePConf} placeHolder='Confirm Password' inputType='password'/>
            </div>
            <div className="w-10/12 ml-[8%] mb-20">
                <button className="txt border border-current w-3/6 ml-[25%] text-3xl" onClick={createUser}>Create New User</button>
            </div>
        </>
    )
}

export default NewUser