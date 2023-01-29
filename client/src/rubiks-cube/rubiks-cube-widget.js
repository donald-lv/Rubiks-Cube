/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import './cube/rubiks-cube.js';
import Cube from './cube/rubiks-cube.js';
import Timer from './timer/timer.js';
import KeyboardController from './keyboard-controller/keyboard-controller.js';

import './rubiks-cube-widget.css';

import bindingsImport from './controls.json';

const { bindings } = bindingsImport;

function CubeWidget(props) {
    const [ timerReady, setTimerReady ] = useState(false);
    const [ isSolving, setIsSolving ] = useState(false);

    const shuffleId = props.id + '-shuffle';
    const resetId = props.id + '-reset';
    const cubeId = props.id + '-cube';
    const timerId = props.id + '-timer';
    const kbControllerId = props.id + '-kb-controller';

    const onFinish = useCallback((event) => {
        try {
            const body = { 
                user_name: "test-user", 
                start_time: new Date(event.detail.startTime).toISOString(), 
                end_time: new Date(event.detail.endTime).toISOString()
            };

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

    const onKBControllerBind = (e) => {
        console.log(e.detail);
        const event = new CustomEvent(cubeId + '-do-rotate', { detail: e.detail });
        document.dispatchEvent(event);
    }

    useEffect(() => {
        document.addEventListener(timerId + '-finish', onFinish);
        document.addEventListener(cubeId + '-touched', onTouch);
        document.addEventListener(cubeId + '-solved', onSolve);
        document.addEventListener(cubeId + '-shuffled', onShuffle );
        document.addEventListener(cubeId + '-reset', onReset );
        document.addEventListener(kbControllerId + '-bind-pressed', onKBControllerBind);

        return (() => {
            document.removeEventListener(timerId + '-finish', onFinish);
            document.removeEventListener(cubeId + '-touched', onTouch);
            document.removeEventListener(cubeId + '-solved', onSolve);
            document.removeEventListener(cubeId + '-shuffled', onShuffle);
            document.removeEventListener(cubeId + '-reset', onReset);
            document.removeEventListener(kbControllerId + '-bind-pressed', onKBControllerBind);
        });
    }, [ timerReady, isSolving ]);

    return (
        <>
            <KeyboardController id={ kbControllerId } bindings={ bindings } />
            <div className="rubiks-cube-widget">
                <div className='rubiks-cube-widget-card rubiks-cube-widget-cube-card'>
                    <Cube id={ cubeId } size={ 3 } />
                </div>

                <div className='rubiks-cube-widget-timer rubiks-cube-widget-card'>
                    <Timer 
                        id={ timerId }
                    />
                </div>

                <div className='rubiks-cube-widget-buttons rubiks-cube-widget-card'>
                    <div>
                        <button className='widget-button shuffle-button' id={ shuffleId }
                            onClick = { 
                                () => {
                                    const event = new CustomEvent(cubeId + '-do-shuffle');
                                    document.dispatchEvent(event);
                                }
                            } >
                            shuffle
                        </button>

                        <button className='widget-button reset-button' id={ resetId }
                            onClick = {
                                () => {
                                    const event = new CustomEvent(cubeId + '-do-reset');
                                    document.dispatchEvent(event);
                                }
                            } >
                            reset
                        </button>
                    </div>
                
                </div>
            </div>
        </>
    );
}

export default CubeWidget;