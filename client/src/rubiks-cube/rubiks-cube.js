import React from 'react';
import './rubiks-cube.css';
import CubeConsts from './cube-consts';

/* 
ABOUT DIRECTIONS:
  
  directions are:
  0: up
  1: right
  2: down
  3: left
*/

// COLORS
const colors = CubeConsts.defaultColors;

// MOUSE DRAG LENGTH (before turning sides)
const dragLength = 10;


function CubeGridSquare(props) {
    /* 
        let direction = something something
        orientation given?

        props.doRotation(direction);

    */
    return (
        <div
            className="cube-square"
            style={ { background : props.color } }
            onDragStart={ () => false }
            onDrop={ () => false }
            onMouseDown={ (e) => {
                if (!props.mouseHeld) {
                    props.mouseHold({ x: e.clientX, y: e.clientY });
                } else {
                    console.log("square not activated, click detected");
                }
            } }
        /> 
    );
}

// given 1 face, draw it
function CubeGridFace(props) {
    // map the double array:
    //   map (nondouble) arrays to rows
    //   map elements of double array to squares
    //
    // inline style here for adjustability, may be better to use variables...
    // display: grid obtained from css
    let display = 
    <div className="cube-face"   
        style={ {
            gridTemplateRows: "repeat(" + props.size + ", 1fr)",
            gridTemplateColumns: "repeat(" + props.size + ", 1fr)"
        } }
    >
    {
        props.face.map(
            (row, rIndex) => (
                row.map(
                    (squareColour, cIndex) => (
                        
                        <CubeGridSquare 
                            color={ colors[squareColour] }

                            mouseHeld={ props.mouseHeld }

                            mouseHold={ 
                                (mousePos) => {
                                    // console.log(`square at ${rIndex} ${cIndex} triggered`);
                                    // pass along the mousePos given,
                                    // provide the holdCoord row and column

                                    props.mouseHold(mousePos, { rIndex: rIndex, cIndex: cIndex });
                                }
                            }
                            
                            key={ cIndex }
                        />
                    )
                )
            )
        )
    }
    </div>;

    return (
        <div className="cube-grid-face">
            { display }
        </div>
    );
}

class CubeGrid extends React.Component {
    constructor(props) {
        super(props);

        document.querySelector(":root").addEventListener( "mouseup",
            (e) => { this.handleRelease(e) }
        );

        this.state = {
            holdPos: { x: 0, y: 0 },
            holdCoords: { face: 0, rIndex: 0, cIndex: 0 },
            mouseHeld: false,
        };
    }

    handleRelease(e) {
        console.log("mouse release");

        // if the mouse was holding on a square
        if (this.state.mouseHeld) {
            // First, determine the direction,
            // and whether to do a rotate at all

            // right of the hold is postive,
            // above the hold is positive
            let deltaCoord = {
                x: e.clientX - this.state.holdPos.x,
                y: this.state.holdPos.y - e.clientY,
            };

            if (this.magnitude(deltaCoord) > dragLength) {
                let direction = 0;

                // determine direction
                if (Math.abs(deltaCoord.x) > Math.abs(deltaCoord.y)) {
                    if (deltaCoord.x > 0) {
                        direction = 1;
                    } else {
                        direction = 3;
                    }

                } else {
                    if (deltaCoord.y > 0) {
                        direction = 0;
                    } else {
                        direction = 2;
                    }
                }

                let depth = 0;

                switch(direction) {
                    case 0:
                        depth = this.state.holdCoords.cIndex;
                        break;
                    case 1:
                        depth = this.state.holdCoords.rIndex;
                        break;
                    case 2:
                        depth = this.props.size - this.state.holdCoords.cIndex - 1;
                        break;
                    case 3:
                        depth = this.props.size - this.state.holdCoords.rIndex - 1;
                        break;
                    default:
                        break;
                }

                this.props.doRotate(this.state.holdCoords.face, depth, direction);
                this.props.doSendCubeTouched();
            } else {
                console.log("no rotation");
            }

            this.setState({ mouseHeld: false });
        }
        
    }

    magnitude(coord) {
        return Math.sqrt(coord.x * coord.x + coord.y * coord.y);
    }

    makeCubeGridFace(face) {
        return (
            <CubeGridFace
                size={ this.props.size }
                face={ this.props.cube[face] }
                mouseHeld={ this.state.mouseHeld }
                mouseHold={ (mousePos, squareCoords) => {
                    squareCoords.face = face;
                    this.setState({
                        holdPos: mousePos,
                        holdCoords: squareCoords, 
                        mouseHeld: true 
                    });
                } }
                
                key={ face }
        />);
    }

    // format subject to change??
    // net of cube:      _
    // default like    _|_|_
    //                |_|_|_|
    //                  |_|
    //                  |_|

    // maybe can change?
    render() {
        return (
            // make a cross shape like in the comment
            <div className="cube-grid">
                <div></div>
                { this.makeCubeGridFace(0) }
                <div></div>

                { [
                    this.makeCubeGridFace(1),
                    this.makeCubeGridFace(2),
                    this.makeCubeGridFace(3),
                ] }

                <div></div>
                { this.makeCubeGridFace(4) }
                <div></div>

                <div></div>
                { this.makeCubeGridFace(5) }
                <div></div>
            </div>
        );
    }
}

// this function is outside Cube
function genDefaultCube(size) {
    // 6 faced cube
    //   each face is 3 rows
    //   each row is 3 elements
    let cube = [[[]]];

    for (let face = 0; face < 6; ++face) {
        cube[face] = [[]];
        for (let row = 0; row < size; ++row) {
            cube[face][row] = [];
            for (let col = 0; col < size; ++col) {
                // faces correspond to colours: 
                //   0 is white, etc, see colors array of objects
                cube[face][row][col] = face;
                // cube[face][row][col] = Math.floor(6 * Math.random());
            }
        }
    }

    return cube;
}

class Cube extends React.Component {
    constructor(props) {
        super(props);
        
        // idk how i should be doing this...
        document.addEventListener(props.id + '-do-shuffle', () => {
            this.shuffle();
        });

        document.addEventListener(props.id + '-do-reset', () => {
            this.reset();
        });

        // 6 faced cube
        //   each face is cube size rows
        //   each row is cube size squares/cubies (i)
        let cube = genDefaultCube(props.size);

        this.state = {
            cube: cube,

            // whether it is solved
            isSolved: true,
            
            // if a human move was made since the cube was reset/shuffled/initialized
            untouched: true,
        }
    }

    // generates a reset cube of given size. one colour per face
    genDefaultCube(size) {
        // 6 faced cube
        //   each face is 3 rows
        //   each row is 3 elements
        let cube = [[[]]];
    
        for (let face = 0; face < 6; ++face) {
            cube[face] = [[]];
            for (let row = 0; row < size; ++row) {
                cube[face][row] = [];
                for (let col = 0; col < size; ++col) {
                    // faces correspond to colours: 
                    //   0 is white, etc, see colors array of objects
                    cube[face][row][col] = face;
                    // cube[face][row][col] = Math.floor(6 * Math.random());
                }
            }
        }
    
        return cube;
    }

    // deep copies another cube
    copyCube(cube) {
        return Cube.state.cube.map( (face) => 
            face.map( (row) => row.slice() )
        );
    }

    // modifies face to have newCol in the cIndexth column
    setCol(face, cIndex, newCol) {
        face.forEach(
            (row, rIndex) => {
                row[cIndex] = newCol[rIndex];
            }
        )
    }

    // modifies face to have newRow in the rIndexth row
    setRow(face, rIndex, newRow) {
        for (let i = 0; i < this.props.size; ++i) {
            face[rIndex][i] = newRow[i];
        }
    }

    getCol(face, cIndex) {
        return face.map( (row) => row[cIndex] );
    }

    getRow(face, rIndex) {
        return face[rIndex];
    }

    /*
        modifies the face by changing the line according to the direction:
        the line is perpendicular to the direction, ordered in a direction + 90 clockwise ( 0->1->2->3->0)
        the line is inset from the furthermost edge along the given by depth
        color is the color

                        <------- depth increases this way
                         _ _ _ _
        ex.             |_|_|0|_|  | direction
        direction=1 --> |_|_|1|_|  |
        depth=1         |_|_|2|_| \|/
                        |_|_|3|_|  V
    */
    setLine(face, depth, direction, newLine) {
        switch(direction) {
            case 0:
                this.setCol(face, depth, newLine.reverse());
                break;
            case 1:
                this.setRow(face, depth, newLine);
                break;
            case 2:
                this.setCol(face, this.props.size - depth - 1, newLine);
                break;
            case 3:
                this.setRow(face, this.props.size - depth - 1, newLine.reverse());
                break;
            default:
                console.log("failed setLine: invalid direction");
        }
    }

    // depth may be misleading, read this.setLine's comments
    getLine(face, depth, direction) {
        switch(direction) {
            case 0:
                return this.getCol(face, depth).reverse();
            case 1:
                return this.getRow(face, depth);
            case 2:
                return this.getCol(face, this.props.size - depth - 1);
            case 3:
                return this.getRow(face, this.props.size - depth - 1).reverse();
            default:
                console.log("failed setLine: invalid direction");
        }
    }

    // direction is one of -1, 0, 1: back 90, 180, forward 90
    rotDirection(direction, rotDir) {
        if (rotDir === 0) {
            return (direction + 2) % 4;
        } else {
            return (4 + direction + rotDir) % 4;
        }
    }

    // rotDir is one of -1, 0, 1: back 90, 180, forward 90
    rotCoord(coord, rotDir) {
        switch (rotDir) {
            case -1:
                return {
                    x: this.props.size - 1 - coord.y,
                    y: coord.x
                };
            case 0:
                return {
                    x: this.props.size - 1 - coord.x,
                    y: this.props.size - 1 - coord.y,
                };
            case 1:
                return {
                    x: coord.y,
                    y: this.props.size - 1 - coord.x
                };
            default:
                console.log("invalid rotation direction");
                return coord;
        }
    }

    // modifies the face by rotating it. 
    // DOES NOT rotate the squares adjacent to the face, just those on the face
    // direction is as according to rotCoord.
    rotateFace(face, direction) {
        let newFace = [[]];

        // fill newFace in order
        //   get square by where it would have been before rotation
        //   (get coord, do reverse rotation, get element in face from reverse rotated coord)
        for (let row = 0; row < this.props.size; ++row) {
            newFace[row] = [];
            
            for (let col = 0; col < this.props.size; ++col) {
                let oldCoord = this.rotCoord({ x: row, y: col }, -direction);
                newFace[row][col] = face[oldCoord.x][oldCoord.y];
            }
        }

        face[0][0] = 3;
        // copy?? ? ?
        for (let row = 0; row < this.props.size; ++row) {
            for (let col = 0; col < this.props.size; ++col) {
                face[row][col] = newFace[row][col];
            }
        }
    }

    // rotates a strip: a loop of cubies (little squares) that goes around the 3d cube
    // {direction} is direction of loop movement
    // depth increases in the direction corrsponding to {direction + 1},
    //
    // see setLine comments for clarification
    rotateStrip(cube, faceIndex, depth, direction) {
        // direction is parallel to the line: need to make it perpendicular
        let lastLine = this.getLine(cube[faceIndex], depth, direction).slice();
        let tempLine = [];

        // starts 1 face after the first, immediately swaps
        // then ends back on first, performs code on first as well
        for (let counter = 0; counter < 4; ++counter) {            
            // change faces and directions
            let nextFaceInfo =   CubeConsts.cubeInfo[faceIndex][direction];
            
            // flip the direction: instead of the direction of the side we just came from, 
            //   its now the direction of side we will be going to
            // direction = this.rotDirection(direction, 0);
            direction = (nextFaceInfo.orient + 2) % 4;

            // yeah
            faceIndex = nextFaceInfo.face;

            // swap the line on the cube and lastLine
            tempLine = this.getLine(cube[faceIndex], depth, direction).slice();
            
            this.setLine(cube[faceIndex], depth, direction, lastLine);
            lastLine = tempLine;
        }
    }

    rotate(cube, faceIndex, depth, direction) {
        console.log("rotating");
        this.rotateStrip(cube, faceIndex, depth, direction);

        // if the side rotated is furthest in or out (if on either side)
        // rotate the corresponding face
        if (depth === 0) {
            this.rotateFace(cube[  CubeConsts.cubeInfo[faceIndex][this.rotDirection(direction, -1)].face], -1);
        } else if (depth === (this.props.size - 1)) {
            this.rotateFace(cube[  CubeConsts.cubeInfo[faceIndex][this.rotDirection(direction, 1)].face], 1);
        }

        this.checkSolved();
    }

    doRotate(faceIndex, depth, direction) {
        let newCube = this.state.cube.slice();
        this.rotate(newCube, faceIndex, depth, direction);

        this.setState(
            { cube: newCube }
        );
    }

    sendEvent(eventName) {
        const event = new CustomEvent(eventName, { details: { id: this.props.id } });
        document.dispatchEvent(event);
    }

    reset() {
        this.setState({ cube: genDefaultCube(this.props.size) });
        this.sendEvent(this.props.id + '-reset');
    }

    shuffle() {
        let newCube = this.state.cube;
        // newCube[0] = 
        let faceIndex, depth, direction = 0;
        let lastFace = 0;

        let moveList = [];

        for (let i = 0; i < 2; ++i) {
            // prevent same face
            // temp
            faceIndex = (Math.floor(5 * Math.random()));
            faceIndex = (faceIndex > lastFace) ? faceIndex : faceIndex + 1;
            // prevent movement of center squares

            depth = Math.floor(Math.floor(this.props.size / 2) * Math.random());
            direction = Math.floor(4 * Math.random());

            this.rotate(newCube, faceIndex, depth, direction);

            moveList[i] = { face: faceIndex, depth: depth, dir: direction };
        }

        console.log(moveList);
        
        this.setState({ cube: newCube });

        this.sendEvent(this.props.id + '-shuffled');
    }

    checkSolved() {
        // check if unsolved
        for (let face = 0; face < 6; ++face) {
            const color = this.state.cube[face][0][0]
            
            for (let row = 0; row < this.props.size; ++row) {
                for (let col = 0; col < this.props.size; ++col) {
                    if (this.state.cube[face][row][col] !== color) {

                        this.setState({ isSolved: false });
                        return;
                    }
                }
            }
        }
       
        // if not unsolved, the it is solved
        this.setState({ isSolved: true });
        this.sendEvent(this.props.id + '-solved');
    }

    doSendCubeTouched() {
        this.sendEvent(this.props.id + '-touched');
    }

    render() {
        return <CubeGrid 
            size={ this.props.size }
            cube={ this.state.cube } 
            doRotate={ (faceIndex, depth, direction) => { this.doRotate(faceIndex, depth, direction) } }
            doSendCubeTouched={ () => { this.doSendCubeTouched(); } } />;
    }
}

export default Cube;