import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId='456403323416-a5r342s55qr28gh3eq0go769khk1pmnc.apps.googleusercontent.com'>
        <App />
    </GoogleOAuthProvider>

);
