import React from "react";
import './Card.css';
import { HandFist } from 'lucide-react';

export const Card = () => {
    return ( 
        <div className ="card-container">
        <div className="card">
            <img src ="https://picsum.photos/200/300" alt="Card Image" className="card-img"/>
            <div className="card-stuff">
                <h1 className="card-title">policy 1</h1>
                <p className="card-text">
                    basically this and that happened and you can do this</p>
                <a href="./following" className="card-btn"> 
                    Fundraisers and Petitions
                </a>
            </div>      
            <HandFist />
        </div>
    </div>
    );
}

export default Card;