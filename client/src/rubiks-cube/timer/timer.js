import React from "react";
import './timer.css';

class Timer extends React.Component {
    constructor (props) {
        super(props);

        console.log("constructed timer");

        document.addEventListener(props.id + '-do-unset', () => {
            
            this.setState({ startTime: 0, endTime: 0, status: 'unset' });

            if (this.state.intervalId) {
                clearInterval(this.state.intervalId);
            }

            const event = new CustomEvent(props.id + '-unset');
            document.dispatchEvent(event);
        });
        
        document.addEventListener(props.id + '-do-start', () => {
            console.log("timer started");
            this.setState({ startTime: Date.now(), status: 'running' });

            if (this.state.intervalId) {
                clearInterval(this.state.intervalId);
            }

            this.state.intervalId = setInterval(() => {
                this.setState({ endTime: Date.now() });
            }, 50);

            const event = new CustomEvent(props.id + '-start');
            document.dispatchEvent(event);
        });

        document.addEventListener(props.id + '-do-finish', () => {
            console.log("timer finished");
            this.setState({ endTime: Date.now(), status: 'finished' });

            if (this.state.intervalId) {
                clearInterval(this.state.intervalId);
            }

            const event = new CustomEvent(props.id + '-finish', { detail: { startTime: this.state.startTime, endTime: Date.now() } });
            document.dispatchEvent(event);
        });

        this.state = {
            intervalId: null,
            startTime: 0,
            endTime: 0,
            // status: unset, running or finished
            status: 'unset'
        };
    }

    getTimeValue() {
        let value = "0";

        switch(this.state.status) {
            case 'unset':
                value = '00:00:00'
                break;
            case 'running':
                value = (Date.now() - this.state.startTime) / 1000;
                break;
            case 'finished':
                value = (this.state.endTime - this.state.startTime) / 1000;
                break;
            default:
                value = "0";
        }

        return value;
    }

    render () {
        return (
            <div className='timer-container'>
                <h1 className={ this.state.status + '-timer-text timer-text' }> 
                    { this.getTimeValue() } 
                </h1>
            </div>
        );
    }
}

export default Timer;