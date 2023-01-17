import React, { useState, useEffect, useCallback } from 'react';
import './rubiks-cube.js';
import Cube from './rubiks-cube.js';
import Timer from './timer.js';

function CubeWidget(props) {
    const [ timerReady, setTimerReady ] = useState(false);
    const [ isSolving, setIsSolving ] = useState(false);

    const shuffleId = props.id + '-shuffle';
    const resetId = props.id + '-reset';
    const cubeId = props.id + '-cube';
    const timerId = props.id + '-timer';

    const onFinish = useCallback((event) => {
        try {
            const body = { 
                user_name: "test-user", 
                start_time: new Date(event.detail.startTime).toISOString(), 
                end_time: new Date(event.detail.endTime).toISOString()
            };

            console.log(body.start_time);

            fetch("http://localhost:5000/leaderboard", { 
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body) 
            } );
    
            console.log("submission made");
            
        } catch(err) {
            console.error(err.message)
        }
    }, [ timerReady, isSolving ]);

    const onTouch = useCallback(() => {

        if (timerReady) {
            console.log("touch received: starting timer");
            
            setTimerReady(false);
            setIsSolving(true);
            
            const event = new CustomEvent(timerId + '-do-start');
            document.dispatchEvent(event);
        }
        

    }, [ timerReady, isSolving ]);


    const onSolve = useCallback((e) => {

        console.log("cube solved");

        if (isSolving) {
            setTimerReady(false);
            setIsSolving(false);
            const event = new CustomEvent(timerId + '-do-finish');
            document.dispatchEvent(event);
        }

    }, [ timerReady, isSolving ]);


    const onShuffle = useCallback(() => {

        setTimerReady(true);
        setIsSolving(false);

        const event = new CustomEvent(timerId + '-do-unset');
        document.dispatchEvent(event);

    }, [ timerReady, isSolving ]);

    const onReset = useCallback(() => {
        
        setTimerReady(false);
        setIsSolving(false);

        const event = new CustomEvent(timerId + '-do-unset');
        document.dispatchEvent(event);

    }, [ timerReady, isSolving ]);

    useEffect(() => {
        document.addEventListener(timerId + '-finish', onFinish);
        document.addEventListener(cubeId + '-touched', onTouch);
        document.addEventListener(cubeId + '-solved', onSolve);
        document.addEventListener(cubeId + '-shuffled', onShuffle );
        document.addEventListener(cubeId + '-reset', onReset );

        return (() => {
            document.removeEventListener(timerId + '-finish', onFinish);
            document.removeEventListener(cubeId + '-touched', onTouch);
            document.removeEventListener(cubeId + '-solved', onSolve);
            document.removeEventListener(cubeId + '-shuffled', onShuffle );
            document.removeEventListener(cubeId + '-reset', onReset );
        });
    }, [ timerReady, isSolving ]);


    return (
        <div className="rubiks-cube-widget">
            <div className="widget-buttons">
                <button className="widget-button" id={ shuffleId }
                    onClick = { 
                        () => {
                            const event = new CustomEvent(cubeId + '-do-shuffle');
                            document.dispatchEvent(event);
                        }
                    } >
                    shuffle
                </button>

                <button className="widget-button" id={ resetId }
                    onClick = {
                        () => {
                            const event = new CustomEvent(cubeId + '-do-reset');
                            document.dispatchEvent(event);
                        }
                    } >
                    reset
                </button>
               
            </div>

            <Cube id={ cubeId } size={ 3 } />
            
            <Timer 
                id={ timerId }
            />
        </div>
    );
}

export default CubeWidget;