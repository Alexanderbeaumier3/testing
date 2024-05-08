import React from "react";
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <Link to={'/addproduct'} style={{ textDecoration: 'none' }}>
                <div className="sidebar-item">
                    <h3>Add Product</h3>
                </div>
            </Link>
            <Link to={'/listproduct'} style={{ textDecoration: 'none' }}>
                <div className="sidebar-item">
                    <h3>Product List</h3>
                </div>
            </Link>
        </div>
    );
}

export default Sidebar;
