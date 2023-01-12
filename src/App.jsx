import { Routes, Route } from 'react-router-dom';

//regular componenet imports
import Nav from './components/Nav';
import Layout from './components/Layout'
import Home from './components/Home';
import Header from './components/Header';
import PersistSignin from './components/PersistSignin';

//user componenet imports
import NewUser from './features/users/NewUser';

//workout componenet imports
import UserWorkouts from './features/users/UserWorkouts';
import SingleWorkout from './features/workouts/SingleWorkout';
import NewWorkoutForm from './features/workouts/NewWorkoutForm';
import SignIn from './components/SignIn';
import { useGetUsersQuery } from './features/users/usersApiSlice';

//toast imports
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//css imports
import './App.css';

function App() {

  return (
    <>
      <Nav />
      <Header />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<SignIn />} />
        </Route>

        <Route element={<PersistSignin />} >

          {/*home element has been moved from the '/' route to be included in the PersistSignin componenet*/}
          <Route path='/home' element={<Home />} />

          {/*Workout Routes*/}
          <Route path='/workouts'>
            <Route path='myworkouts' element={<UserWorkouts />} />
            <Route path=':id' element={<SingleWorkout />} />
            <Route path='new' element={<NewWorkoutForm />} />
          </Route>

          {/* User Routes */}
          <Route path='/user'>
            <Route path='new' element={<NewUser />}/>
          </Route>
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false}
                    closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"/>
    </>
  );
}

export default App;
