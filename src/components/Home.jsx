import { Link } from "react-router-dom";
import WorkoutsList from "../features/workouts/workoutsList";

const Home = () => {
    const content = (
        <div className="flex flex-col justify-center bg-zinc-800">
            <div className="flex justify-center">
                <WorkoutsList />
            </div>
        </div>
    )
    return content
}

export default Home