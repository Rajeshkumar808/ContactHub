import {configureStore} from '@reduxjs/toolkit';import auth from './features/authSlice';import contacts from './features/contactsSlice';export const store=configureStore({reducer:{auth,contacts}});
