//import muscle group array
import groups from "../../groups"

//fontawesome imports
import { faRectangleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Exercise = (props) => {

    if (props.edit) {

        const muscleGroups = groups.map(group => {
            return <option value={group}>{group}</option>
        })

        const handleChange = (event) => {
            props.func(props.idKey, event.target.value, event.target.name)
        }

        return (
            <div className="border rounded-2xl mb-4 pb-3 flex justify-end">
                <form className="flex w-[97%]">
                    <input type={'text'} 
                    className="border-b-2 txt-2 border-current bg-zinc-800 
                                inputz text-lg 
                                mt-4 focus: outline-0
                                pl-2 b-1 txt ml-4" 
                    placeholder="Exercise name"
                    onFocus={(e) => e.target.placeholder = ''}
                    onBlur={(e) => e.target.placeholder = 'Enter a title'} onChange={handleChange} name="title"/>
                    <input type={'Number'} 
                    className="border-b-2 txt-2 border-current bg-zinc-800 
                                inputz text-lg 
                                mt-4 focus: outline-0
                                pl-2 b-1 txt ml-4 w-20" 
                    placeholder="Sets"
                    onFocus={(e) => e.target.placeholder = ''}
                    onBlur={(e) => e.target.placeholder = 'Sets'} onChange={handleChange} name="sets"/>
                    <p className="text-2xl txt ml-3 mt-4">x</p>
                    <input type={'Number'} 
                    className="border-b-2 txt-2 border-current bg-zinc-800 
                                inputz text-lg 
                                mt-4 focus: outline-0
                                pl-2 b-1 txt ml-4 w-20" 
                    placeholder="Reps"
                    onFocus={(e) => e.target.placeholder = ''}
                    onBlur={(e) => e.target.placeholder = 'Reps'} onChange={handleChange} name="reps"/>
                    <div className="flex ml-6">
                        <p className="txt text-lg mt-5">Select A Muscle Grouping:</p>
                        <select className="border-b-2 txt-2 border-current bg-zinc-800 
                                inputz text-lg 
                                mt-4 focus: outline-0
                                b-1 txt ml-4" onChange={handleChange} name="group">
                            <option value="" disabled selected>Select one</option>
                            {muscleGroups}
                        </select>
                    </div>
                </form>
                <FontAwesomeIcon icon={faRectangleXmark} className="txt text-4xl hover:text-white mt-3 mr-5" onClick={() => props.delete(props.idKey)}/>
            </div>
        )
    } else {
        return (
            <div className="border rounded-2xl mb-4 pb-3">
                <div className="flex justify-around">
                    <p 
                    className="txt-2 bg-zinc-800 
                                text-lg 
                                mt-4 focus: outline-0
                                pl-2 b-1 txt">Exercise Name: {props.title}</p>
                    <p type={'Number'} 
                    className="txt-2 bg-zinc-800 
                                text-lg 
                                mt-4 focus: outline-0
                                pl-2 b-1 txt" 
                    >Sets: {props.sets}</p>
                    <p 
                    className="txt-2 bg-zinc-800 
                                text-lg 
                                mt-4 focus: outline-0
                                pl-2 b-1 txt" 
                    >Reps/Set: {props.reps}</p>
                    <div className="flex mt-4">
                        <p className="txt text-lg">Muscle Group:</p>
                        <p className="txt bg-zinc-800 text-lg ml-2">{props.groups}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Exercise