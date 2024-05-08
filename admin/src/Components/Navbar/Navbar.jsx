import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className='navbar__content'>
                <h1 className='navbar__title'>Admin Dashboard</h1>
                <h2 className='navbar__middle'>D&B EMBROIDERY</h2>
                <button className='navbar__logout'>Logout</button>
            </div>
        </div>
    );
}

export default Navbar;
