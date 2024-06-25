import React from 'react';
import { Link } from 'react-router-dom';
import './Share.css';

const Share = () => {
    return (
        <div className='menu'>
            <div className='toggle'>
                <ion-icon name="share-social"></ion-icon>
            </div>
            <ul>
                <li style={{ '--i': 0, '--clr': '#1877f2' }}>
                    <a href="#"><ion-icon name="logo-facebook"></ion-icon></a>
                    <a href="#"><ion-icon name="logo-facebook"></ion-icon></a>
                    <a href="#"><ion-icon name="logo-facebook"></ion-icon></a>
                    <a href="#"><ion-icon name="logo-facebook"></ion-icon></a>
                    <a href="#"><ion-icon name="logo-facebook"></ion-icon></a>
                </li>
            </ul>
        </div>
      );
}

export default Share;
