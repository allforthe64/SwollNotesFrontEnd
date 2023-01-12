import { useGetWorkoutsQuery } from "./workoutApiSlice";
import Workout from "./workout";
import { useParams, Link, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import { useEffect } from "react";

const WorkoutsList = () => {

    const workoutIdParams = useParams().id

    const navigate = useNavigate()

    const {
        data: workouts,
        isloading,
        isSuccess,
        isError,
        error
    } = useGetWorkoutsQuery()

    let content

    if (isloading) content = <p>Loading...</p>


    if (isError) {
        console.log(error)
        navigate('/')
        toast.error('Please signin to view workouts')
    }

    useEffect(() => {
        if (!localStorage.getItem('username')) {
            navigate('/')
            toast.error('Please signin to view workouts')
        }
    }, [])

    if (isSuccess) {

        if (workoutIdParams) {

            content = (
                <div>
                    <Workout key={workoutIdParams} workoutId={workoutIdParams} horz={true} />
                </div>
            )
        } else {
        
            const { ids } = workouts

            const listContents = ids?.length
                ? ids.map(workoutId => <Workout key={workoutId} workoutId={workoutId}/>)
                : null

            content = (
                <div>
                    {listContents}
                </div>
            )
        }

        return content
    }

    return content
}

export default WorkoutsList