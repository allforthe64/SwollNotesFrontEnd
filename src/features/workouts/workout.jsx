import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectworkoutById } from "./workoutApiSlice";
import { useUpdateWorkoutMutation } from "./workoutApiSlice";
import { useUpdateUserMutation } from "../users/usersApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";

//fontawesome imports
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from "react";

//exercise componenet import
import Exercise from "../exercises/Exercise";


const Workout = ({ workoutId, horz }) => {
    console.log('rendering')
    const [foobar, setFoobar] = useState('')

    const workout = useSelector(state => selectworkoutById(state, workoutId))

    const navigate = useNavigate()

    //create update workout function
    const [updateWorkout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateWorkoutMutation()

    const [updateUser, {
        uIsLoading,
        usIsSuccess,
        uIsError,
        uError
    }] = useUpdateUserMutation()

    //define get users query and user data
    const {
        data: users,
        uGIsLoading,
        uGIsError,
        uGError
    } = useGetUsersQuery()

    //define like function
    const likeWorkout = (currLikes) => {

        let currentUser
        
        if (localStorage.getItem('currentUserLikedPosts').length === 0) {
            let userinfo = []
            for (let key in users['entities']) userinfo.push(users['entities'][key])
                for (let i in userinfo) {
                    if (userinfo[i].username === localStorage.getItem('username')) {
                        currentUser = userinfo[i]
                }
            }
            localStorage.setItem('currentUserLikedPosts', currentUser.likedPosts)
            localStorage.setItem('currentUser', JSON.stringify(currentUser))
        } else {
            currentUser = JSON.parse(localStorage.getItem('currentUser'))
            if (currentUser.likedPosts.length !== 0) {
                console.log(currentUser.likedPosts)
                localStorage.setItem('currentUserLikedPosts', currentUser.likedPosts)
            }
        }
    
        //create new workout and user variable
        let newWorkout
        let newUser

        let currentLikedPosts = localStorage.getItem('currentUserLikedPosts')
        let likedPostsArr = []

        console.log(currentLikedPosts)

        if (currentLikedPosts.length > 0) {
            console.log('in the first loop')
            if (currentLikedPosts.includes(workout._id)) {
                localStorage.setItem('currentUserLikedPosts', currentLikedPosts.split(',').filter(el => el !== workout._id))
                newWorkout = {...workout, likes: currLikes - 1}
            } else {
                likedPostsArr.push(currentLikedPosts)
                likedPostsArr.push(workout._id)
                localStorage.setItem('currentUserLikedPosts', likedPostsArr)
                newWorkout = {...workout, likes: currLikes + 1}
            }
        }
        else {
            console.log('in the second loop')
            likedPostsArr.push(workout._id)
            likedPostsArr.push(currentLikedPosts)
            localStorage.setItem('currentUserLikedPosts', likedPostsArr)
        }
        currentLikedPosts = localStorage.getItem('currentUserLikedPosts')

        let parsedArr = currentLikedPosts.split(',').filter(el => el !== '[]')
        console.log(parsedArr)

        //create the new updated workout and user objects
        newUser = {...currentUser, likedPosts: parsedArr}

        console.log(currentUser)
        console.log(newUser)
        updateUser(newUser)
            
        updateWorkout(newWorkout)
        
        window.location.reload()
    }

    if (workout) {

        if (horz) {

            

            let exericses = workout.exercises.map(ex => <Exercise key={ex[0]} idKey={ex[0]} edit={false} title={ex[1]} sets={ex[2]} reps={ex[3]} groups={ex[4]}/>)

            return (
                <>
                    <h1 className="txt text-5xl text-center mb-4">{workout.title}</h1>
                    <div className="flex space-between space-x-10 pt-2 justify-center mb-8">
                        <p className="txt leading-8 text-lg">Created By: {workout.creator}</p>
                        <p className="txt leading-8 text-lg">Likes: {workout.likes}</p>
                        <p className="txt leading-8 text-lg">Tags: {workout.tags.join(', ')}</p>
                        <FontAwesomeIcon icon={faHeart} className="txt text-4xl hover:text-white " onClick={() => likeWorkout(workout.likes)} />
                    </div>
                    <p className="txt  w-7/10 ml-[15%] mr-[15%] text-4xl mb-4">Workout Notes:</p>
                    <p className="txt w-7/10 ml-[20%] mr-[10%] text-lg mb-8">{workout.comments}</p>
                    <h1 className="txt text-5xl text-left mb-4 mt-20 ml-[15%]">Exercises:</h1>
                    <div className="w-8/12 mt-8 ml-[15%]">
                        {exericses}
                    </div>
                    <div className="w-6/12 ml-[25%] mb-20">
                        <button className="txt border border-current w-3/6 ml-[25%] mt-12 text-3xl">Start Workout</button>
                    </div>
                </>
            )
        }

        const viewWorkout = () => navigate(`/workouts/${workoutId}`)

        return (
            <div className="border rounded-2xl mb-4 pb-4">
                <div className="flex space-between space-x-10 pt-2 pb-2 pl-8">
                    <p className="txt text-lg">{workout.title}</p>
                    <p className="txt leading-8">Created By: {workout.creator}</p>
                    <p className="txt leading-8">Likes: {workout.likes}</p>
                    <p className="txt leading-8">Tags: {workout.tags.join(', ')}</p>
                </div>
                <div className="flex space-between space-x-10 pl-8">
                    <FontAwesomeIcon icon={faHeart} className="txt text-4xl hover:text-white " />
                    <button className="border-btn txt px-4 rounded-lg" onClick={viewWorkout}>View Workout</button>
                </div>
            </div>
        )

    } else return null
}

export default Workout