import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie'; // تأكد من هذا الاستيراد
import { errormsg, successmsg } from '../../toastifiy';

interface User {
  id: number;
  email: string;
  token: string; 
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk<User, LoginCredentials, { rejectValue: string }>(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post('https://pro1-4zoz.onrender.com/app/user/login', credentials);
      const user = {
        id: response.data.id,
        email: credentials.email,
        token: response.data.access_token
      } as User;
      console.log(response);
      if (response.status === 200) {
        Cookies.set('access_token', response.data.access_token); // تأكد من استخدام set بشكل صحيح
        successmsg({ msg: `${response.data.success}` });

       
        
        


      }
      return user;
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      errormsg({ msg: `${error.response?.data}` });
      return thunkAPI.rejectWithValue(
        error.response?.data as string || 'An error occurred'
      );
    }
  }
);

const loginSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      Cookies.remove('access_token'); // تأكد من استخدام remove بشكل صحيح
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
