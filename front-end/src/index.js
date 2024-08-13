import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
 
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
    <GoogleOAuthProvider children> 
     {/* clientId='110570244233-j34ratlsgoppc8tnubqjk96gl24equpn.apps.googleusercontent.com' */}
        <App />
    </GoogleOAuthProvider>

);
