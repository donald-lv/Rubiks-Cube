import './leaderboard.css';
import React, { useState, useEffect } from "react";

function LeaderBoard(props) {

    const [ rows, setRows ] = useState([]);
    const solveTimeFormat = Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 4 
    });
    
    async function fetchRows() {
        const response = await fetch("http://localhost:5000/leaderboard");
        const parsedObj = await response.json();

        console.log(parsedObj.rows);

        setRows(parsedObj.rows);
    }

    useEffect(() => { fetchRows() }, []);
    
    // takes the start and end dates as strings, then produces a string to represent it the difference between their times
    function twoDatesTimeToString (startTime, endTime) {
        return ((Date.parse(endTime) - Date.parse(startTime)) / 1000);

        // ignore below for now
        /*
        const timeAsDate = new Date( Date.parse(endTime) - Date.parse(startTime) );
        
        // ret string includes all amounts for the units of time smaller the largest unit of time
        // ex. 2Y/0M/0D 01:32:00.33 - year is the greatest amount, show every unit less than it, even if its 0
        // but only include 4 digits for sub second if there are no days/time/month

        // ordered years to subsecond
        const timeUnitVals = [ timeAsDate.getFullYear(), timeAsDate.getMonth(), timeAsDate.getDay(), 
                            timeAsDate.getHours(), timeAsDate.getMinutes(), timeAsDate.getSeconds(), 
                            timeAsDate.getMilliseconds() ];
        
        let firstNZUnit = 0;
        // count firstNZUnit up until a nonzero unit is found in timeUnitVals
        for (; timeUnitVals[firstNZUnit] === 0 && firstNZUnit < timeUnitVals.length; ++firstNZUnit);
        
        // as seen on https://stackoverflow.com/a/7790858
        // 2 unit zpad
        let i = 0;

        return (`${timeUnitVals[0]}Y/${timeUnitVals[1]}M/${timeUnitVals[2]}D ${timeUnitVals[3]}:${timeUnitVals[4]}:${timeUnitVals[5]}.${timeUnitVals[6]}`);
        */
    }

    return(
        <div className="leaderboard-container">
            <h3 className='leaderboard-header'>Leaderboard</h3>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Place</th>
                        <th>User Name</th>
                        <th>Time</th>
                        <th>Submission Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rows.map( (item, index) => { return (
                            <tr key={ index }>
                                <td>{ index + 1 }</td>
                                <td>{ item.user_name }</td>
                                <td>{ twoDatesTimeToString(item.start_time, item.end_time) }</td>
                                <td>{ new Date(Date.parse(item.submission_time)).toDateString() }</td>
                            </tr>
                        ); } )
                    }
                </tbody>
            </table>
        </div>
    );
}

export default LeaderBoard;