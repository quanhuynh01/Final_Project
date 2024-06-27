import React from 'react';
import { Link } from 'react-router-dom';
import './Category.css';

const Category = ({ categories = []}) => {
    return (
        <div className='container'>
          {
            categories.filter(s => s.show === true).map((item, index) => (
              <Link key={index} to={`danh-muc/${item.id}`} className='item'>
                <div className='quote'>
                  <p>{item.nameCategory}<span>{item.nameCategory}</span></p>
                </div>
                <div className='img-cate'>
                  <img
                    style={{ height: "50px", width: "70px" }}
                    src={`https://localhost:7201/${item.iconCate}`}
                    alt={item.nameCategory}
                  />
                </div>
              </Link>
            ))
          }
        </div>
      );
}

export default Category;
