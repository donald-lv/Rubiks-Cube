import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import Cube from './rubiks-cube.js';
import LeaderBoard from './leaderboard/leaderboard.js';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <>
        <Cube />
        <LeaderBoard />
    </>

);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
