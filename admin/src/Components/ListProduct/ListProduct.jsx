import React, { useState, useEffect } from "react";
import "./ListProduct.css";
import crossIcon from "../../assets/crossIcon.png";

const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([]);

    const fetchInfo = async () => { 
        await fetch("http://localhost:4000/allproducts")
        .then((res) => {
            if (!res.ok) {
                throw new Error("HTTP error " + res.status);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setAllProducts(data);
        });   
    }

    useEffect(() => {
      fetchInfo();
    }, []);  
    

    return (
        <div className="list-product">
            <h1>All Products</h1>
            <div className="listproduct-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Category</p>
                <p>Remove</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {allproducts && Array.isArray(allproducts) && allproducts.map((product, index) => {
                   return <div key={index} className="listproduct-format-main listproduct-format">
                        <img src={product.image} alt="" className="listproduct-product-icon" />
                        <p>{product.name}</p>
                        <p>${product.new_price}</p>
                        <p>{product.category}</p>
                        <img className="listproduct-remove-icon" src={crossIcon} alt="" />
                   </div>
                })}
            </div>
        </div>
    );
}

export default ListProduct;
