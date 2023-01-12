import { useState, useEffect, useRef } from "react"
import { useAddNewWorkoutMutation } from "./workoutApiSlice"
import { useNavigate } from "react-router-dom"

//componenet imports
import Exercise from '../exercises/Exercise'
import Tag from "../../components/Tag"
import { toast } from 'react-toastify';
import FormInput from "../../components/FormInput"


//import muscle group data
import groups from "../../groups"


const NewWorkoutForm = () => {

    //navigate variable
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('persist') === 'false') {
            if (localStorage.getItem('oneTime') === 'true') {
                localStorage.setItem('oneTime', false)
            } else {
                navigate('/')
                toast.error('Please sign in again to view workouts')
            }
        } else {
            console.log('in here')
        }
    }, [])

    //append additional tags to tags array
    const presetTags = ['Push', 'Pull', 'Legs', 'Arms', 'Back']
    groups.map(el => presetTags.push(el))

    //define variable to hold redux query
    const [addNewWorkout, {
        isLoading,
        isSucces,
        isError,
        error
    }] = useAddNewWorkoutMutation()

    //define state to hold user input data
    const [title, setTitle] = useState('')
    const [exercises, setExercises] = useState([])
    const [tags, setTags] = useState(presetTags)
    const [activeTags, setActiveTags] = useState([])
    const [comments, setComments] = useState('') 

    //populate select tag with workout tags
    const tagOptions = tags.map(el => <option value={el}>{el}</option>)

    //add a tag to the workout
    const addTag = (event) => {
        setTags(prevTags => prevTags.filter(el => el !== event.target.value))
        setActiveTags(prevActive => [...prevActive, event.target.value])
    }  

    //delete a tag
    const deleteTag = (tagName) => {
        setActiveTags(prevActive => {
            let result = prevActive.filter(element => element !== tagName)
            return result
        })
        setTags(() => {
            let result = []
            let searchingFor = activeTags.filter(el => el !== tagName)
            presetTags.map(el => {
                if (searchingFor.includes(el) === false) result.push(el)
            })
            return result
        })
    }

    //handle a change to the workout title
    const handleChange = (event) => {
        setTitle(event.target.value)
    }

    const changeComments = (event) => {
        setComments(event.target.value)
    }

    //add an exercise
    const addExercise = () => {

        const idKey = Math.floor(Math.random() *100000)
        
        setExercises(prevExercises => [
            ...prevExercises,
            {   
                id: idKey, 
                element: <Exercise delete={removeEx} key={idKey} idKey={idKey} func={updateEx} edit={true}/>,
                title: "",
                sets: null,
                reps: null,
                group: ""
            }
        ])
    }

    //remove an exercise
    const removeEx = (idKey) => {
        setExercises(prevExercises => {
            let array = prevExercises
            let result = array.filter(element => element.id !== idKey)
            return result
        })
    }

    //update an exercises fields
    const updateEx = (idKey, value, field) => {
        setExercises(prevExercises => {
            let arr = prevExercises
            let entry = prevExercises.filter(exercise => exercise.id === idKey)
            let index = arr.indexOf(entry[0])
            entry[0][field] = value
            arr[index] = entry[0]
            return arr
        })  
    }

    //create the workout object
    const createWorkout = async (e) => {

        e.preventDefault()

        //get the data
        let newTitle = title
        let newTags = activeTags
        let newExercises = exercises
        let creator = localStorage.getItem('username')
        let likes = 0
        let failed = false

        //make sure the data is valid
        if (!newTitle || newTitle === "") {
            toast.error('Please Enter A Title!')
            failed = true
        } else if (newExercises.length === 0) {
            toast.error('Please Add Some Exercises!')
            failed = true
        } else if (newTags.length === 0) {
            toast.error('Please Add Some Tags')
            failed = true
        }

        //validate the exercise data and make sure all entries are filled
        exercises.map(exercise => {
            if (exercise.title === "" || !exercise.title || !exercise.sets || !exercise.reps || exercise.group === "" || !exercise.group) {
                toast.error('Please Ensure All Exercises Are Filled Out!')
                failed = true
            }
        })

        //if data is valid, run the workout creation process
        if (failed !== true) {
            // turn exercise data into smth that's actually JSON stringifiable XD
            let newEx = []
            let final = []
            for(let ex of exercises) {
                for (let part in ex) {
                    if (part !== 'element') {
                        newEx.push(ex[`${part}`])
                    }
                }
                final.push(newEx)
                newEx = []
            }
            let body = {creator, title, likes, final, activeTags, comments}

            //create the workout
            await addNewWorkout(body)

            toast.success(`New Workout: ${title} Successfully Created`)

            navigate('/home')

        }

    }

    return (
        <>
            <h1 className="txt text-5xl text-center mb-4">Create A New Workout:</h1>
            <div className="w-4/5 ml-[10%]">
                <FormInput Change={handleChange} placeHolder='Enter a title' inputType='text'/>
            </div>
            <div className="w-10/12 ml-[8%]">
            <button className="txt border border-current w-3/6 ml-[25%] mt-12 text-3xl mb-6" onClick={addExercise}>Add an exercise</button>
                {exercises.map(exercise => {
                    return exercise.element
                })}
            </div>
            <div className="w-4/5 ml-[10%] mt-16">
                <form>
                    <div className="flex">
                        <p className="txt text-4xl mt-5">Add Tags:</p>
                        <select className="border-b-2 txt-2 border-current bg-zinc-800 
                                    inputz text-4xl
                                    mt-4 focus: outline-0
                                    b-1 txt ml-6 mb-10" name="tags" onChange={addTag}>
                                <option value="" disabled selected>Select one</option>
                                {tagOptions}
                        </select>
                    </div>
                    <div className="flex">
                        {activeTags.map(tag => <Tag tagName={tag} func={deleteTag}/>)}
                    </div>
                </form>
            </div>
            <div className="w-4/5 ml-[10%] mt-16">
                <form>
                    <p className="text-4xl txt">Workout Comments:</p>
                    <textarea onChange={changeComments} rows="10" className="w-[70%] 
                        border-2 txt bg-zinc-800 border-current mt-4 pl-2 pt-2 
                        focus:outline-inherit"></textarea>
                </form>
            </div>
            <div className="w-10/12 ml-[8%] mb-20">
                <button className="txt border border-current w-3/6 ml-[25%] mt-12 text-3xl" onClick={createWorkout}>Create Workout</button>
            </div>
        </>
    )
}

export default NewWorkoutForm