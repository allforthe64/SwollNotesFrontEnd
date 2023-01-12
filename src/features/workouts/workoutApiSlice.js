import {
    createSelector,
    createEntityAdapter
} from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const workoutsAdapter = createEntityAdapter({})

const initialState = workoutsAdapter.getInitialState()

export const workoutsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getWorkouts: builder.query({
            query: () => ({
                url: '/workouts',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadedworkouts = responseData.map(workout => {
                    workout.id = workout._id
                    return workout
                })
                return workoutsAdapter.setAll(initialState, loadedworkouts)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Workout', id: 'LIST'},
                        ...result.ids.map(id => ({ type: 'workout', id}))
                    ]
                } else {
                    return [{ type: 'Workout', id: 'LIST'}]
                }
            }

        }),
        addNewWorkout: builder.mutation({
            query: initialWorkoutData => ({
                url: '/workouts',
                method: 'POST',
                body: {
                    ...initialWorkoutData
                } 
            }),
            invalidatesTags: [{ type: 'Workout', id: 'LIST' }]
        }),
        updateWorkout: builder.mutation({
            query: initialWorkoutData => {
                return {
                    url: '/workouts',
                    method: 'PATCH',
                    body: {
                        ...initialWorkoutData
                    }
                }  
            },
            invalidatesTags: (result, error, arg) => [
                { type: 'Workout', id: arg.id}
            ]
        }),
        deleteWorkout: builder.mutation({
            query: ({ id }) => ({
                url: '/workouts',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Workout', id: arg.id}
            ]
        })
    })
})

export const { 
    useGetWorkoutsQuery,
    useAddNewWorkoutMutation,
    useUpdateWorkoutMutation,
    useDeleteWorkoutMutation } = workoutsApiSlice

//returns the query result object
export const selectWorkoutsResult = workoutsApiSlice.endpoints.getWorkouts.select()

//creates memoized selector
const selectWorkoutsData = createSelector(
    selectWorkoutsResult,
    workoutsResult => workoutsResult.data 
)

//getSelectors creates these selectors and we rename them with aliases
export const {
    selectAll: selectAllworkouts,
    selectById: selectworkoutById,
    selectIds: selectworkoutIds
    //pass in a selector that returns the workouts slice of state
} = workoutsAdapter.getSelectors(state => selectWorkoutsData(state) ?? initialState)
