import React from "react";
import './keyboard-controller.css'


/* FOR KEYBOARD CODES CHECK https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values */

function KeyboardControllerCard (props) {
    function keysAreHeld (keysHeld, keys) {
        for (const char of keys) {
            if (!keysHeld.has(char)) {
                return false;
            }
        }
        
        return true;
    }

    return (
        <div className={"keyboard-tester-card" + ((keysAreHeld(props.keysHeld, props.bindingKeys)) ? " keyboard-tester-card-pulse" : "")} />
    );
}

class KeyboardController extends React.Component {
    constructor(props) {
        console.log("kb created");
        super(props);

        this.state = {
            bindingsHeld: this.props.bindings.map(() => false),
            keysHeld: new Set()
        };
        
        console.log(this.state.bindingsHeld);

        document.addEventListener('keydown', (e) => {
            let newKeysHeld = this.state.keysHeld;
            newKeysHeld.add(e.key);
            this.setState({ keysHeld: newKeysHeld });
            this.checkKeyDown();
        });

        document.addEventListener('keyup', (e) => {
            let newKeysHeld = this.state.keysHeld;
            newKeysHeld.delete(e.key);
            this.setState({ keysHeld: newKeysHeld });
            this.checkKeyUp();
        });
    }

    keysAreHeld (keysHeld, keys) {
        for (const char of keys) {
            if (!keysHeld.has(char)) {
                return false;
            }
        }
        return true;
    }

    checkKeyDown() {
        const newBindingsHeld = this.state.bindingsHeld;
        this.props.bindings.forEach(
            (binding, index) => {
                console.log(this.state.bindingsHeld[index]);
                if (!this.state.bindingsHeld[index] && this.keysAreHeld(this.state.keysHeld, binding.keys)) {
                    newBindingsHeld[index] = true;

                    const e = new CustomEvent(this.props.id + '-bind-pressed', { detail: binding.detail });
                    document.dispatchEvent(e);
                }
            }
        );

        this.setState({ bindingsHeld: newBindingsHeld });
    }

    checkKeyUp() {
        const newBindingsHeld = this.state.bindingsHeld;

        this.props.bindings.forEach(
            (binding, index) => {
                console.log(this.state.bindingsHeld[index]);
                if (this.state.bindingsHeld[index] && !this.keysAreHeld(this.state.keysHeld, binding.keys)) {
                    newBindingsHeld[index] = false;
                }
            }
        );

        this.setState({ bindingsHeld: newBindingsHeld });
    }

    render () {
        return (
            <div className="keyboard-tester">
                {
                    this.props.bindings.map(
                        (item, index) => (<KeyboardControllerCard key={ index } keysHeld={ this.state.keysHeld } bindingKeys={ item.keys } />)
                    )
                }
                
            </div>
        );
    }
}

export default KeyboardController;
