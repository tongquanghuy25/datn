import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
    phone: '',
    avatar: '',
    dateOfBirth: '',
    gender: '',
    access_token: '',
    id: '',
    role: '',
    refreshToken: ''
}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { name = '', email = '', access_token = '', phone = '', avatar = '', dateOfBirth = '', gender = '', id = '', role = '', refreshToken = '' } = action.payload
            state.name = name ? name : state.name;
            state.email = email ? email : state.email;
            state.phone = phone ? phone : state.phone;
            state.avatar = avatar ? avatar : state.avatar;
            state.dateOfBirth = dateOfBirth ? dateOfBirth : state.dateOfBirth;
            state.gender = gender ? gender : state.gender;
            state.id = id ? id : state.id
            state.access_token = access_token ? access_token : state.access_token;
            state.role = role ? role : state.role;
            state.refreshToken = refreshToken ? refreshToken : state.refreshToken;
        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.phone = '';
            state.avatar = '';
            state.dateOfBirth = '';
            state.gender = '';
            state.id = '';
            state.access_token = '';
            state.role = '';
            state.refreshToken = ''
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer