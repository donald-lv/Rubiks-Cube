import React from 'react';
import './rubiks-cube.css';

// test css variable changing
/*
    var r = document.querySelector(':root');
    rt.style.setProperty("--some-color", "red");
*/

// CUBE SIZE
const cubeSize = 3;

// goofy ah css variables
// let cubeStyle = document.querySelector("body");
// console.log(cubeStyle);

// cubeStyle.style.setProperty("--cube-size", cubeSize);


/*
    todo: 
    change the holding so that you can only hold on one square:
    when you hold down on a square and drag across others, you trigger the mouseDown event on them
    
    a fix: put the state inside the grid, get it to change when holding, relay it back down to the squares

fixed    fix rotating cubesize 3 depth 2 direction 0 face 2 making a wrong face rotation
         fix is probably in the rotate function, in the if statement
*/


// COLORS
const colors = [
    "#eae032", // yellow
    "#F82039", // red
    "#00E05F", // green
    
    "#FFA810",  //orange
    "#D0D0E0", // white
    "#0068F0", // blue

    "#000000", // black
];

// directions are:
//  0: up
//  1: right
//  2: down
//  3: left

// which faces are adjacent to which and their relative orientation

// this data could be stored in a 6x6 2d array but this has faster 
//   access since its laid out in a more useful way and its easier? to read (debatable)
const cubeInfo = [
    // face 0 is adjacent to faces 5, 3, 2, 1 in that order from top, right, bottom, left
    // 5 shares 0's top row, 3 shares 0's right, 2 - 0's bot, 1 - 0's left
    // 
    // face 1's adjacent edge is its top row: (0,0) (1,0) (2, n) etc.
    // face 2, 3 also adjacent edge top row
    // face 5 shares its bottom row: (0, n) (1, n) (2, n) etc. 
    [{ face: 5, orient: 2 }, { face: 3, orient: 0 }, { face: 2, orient: 0 }, { face: 1, orient: 0 }],
    [{ face: 0, orient: 3 }, { face: 2, orient: 3 }, { face: 4, orient: 3 }, { face: 5, orient: 3 }],
    
    [{ face: 0, orient: 2 }, { face: 3, orient: 3 }, { face: 4, orient: 0 }, { face: 1, orient: 1 }],
    [{ face: 0, orient: 1 }, { face: 5, orient: 1 }, { face: 4, orient: 1 }, { face: 2, orient: 1 }],
    
    [{ face: 2, orient: 2 }, { face: 3, orient: 2 }, { face: 5, orient: 0 }, { face: 1, orient: 2 }],
    [{ face: 4, orient: 2 }, { face: 3, orient: 1 }, { face: 0, orient: 0 }, { face: 1, orient: 3 }],
];

const dragLength = 10;

// random stolen function for sleeping stolen from the internet
//   please replace with await + async + setTimeout() (somehow, idk)
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

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
    <div id="test">
        <div className="cube-face"   
            style={ {
                gridTemplateRows: "repeat(" + cubeSize + ", 1fr)",
                gridTemplateColumns: "repeat(" + cubeSize + ", 1fr)"
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
                                        console.log(`square at ${rIndex} ${cIndex} triggered`);
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
        </div>
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

        this.state = {
            holdPos: { x: 0, y: 0 },
            holdCoords: { face: 0, rIndex: 0, cIndex: 0 },
            mouseHeld: false,
        };

        document.querySelector(":root").addEventListener( "mouseup",
            (e) => { this.handleRelease(e) }
        );
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
                console.log("yes rotation");
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
                        depth = cubeSize - this.state.holdCoords.cIndex - 1;
                        break;
                    case 3:
                        depth = cubeSize - this.state.holdCoords.rIndex - 1;
                        break;
                    default:
                        break;
                }

                this.props.doRotate(this.state.holdCoords.face, depth, direction);
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

class Cube extends React.Component {
    constructor(props) {
        super(props);

        // 6 faced cube
        //   each face is 3 rows
        //   each row is 3 elements
        let cube = [[[]]];

        for (let face = 0; face < 6; ++face) {
            cube[face] = [[]];
            for (let row = 0; row < cubeSize; ++row) {
                cube[face][row] = [];
                for (let col = 0; col < cubeSize; ++col) {
                    // faces correspond to colours: 
                    //   0 is white, etc, see colors array of objects
                    cube[face][row][col] = face;
                    // cube[face][row][col] = Math.floor(6 * Math.random());
                }
            }
        }

        this.state = {
            cube: cube,
            original: this.copyCube(cube),
            // debug properties
            depth: 0,
            direction: 0,
            faceIndex: 0,
            move: 0,
        }
    }

    copyCube(cube) {
        return cube.map( (face) => 
            face.map( (row) => row.slice() )
        );
    }

    reset() {
        console.log(this.state.original);
        this.setState({ cube: this.copyCube(this.state.original) });
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
        for (let i = 0; i < cubeSize; ++i) {
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
                this.setCol(face, cubeSize - depth - 1, newLine);
                break;
            case 3:
                this.setRow(face, cubeSize - depth - 1, newLine.reverse());
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
                return this.getCol(face, cubeSize - depth - 1);
            case 3:
                return this.getRow(face, cubeSize - depth - 1).reverse();
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
                    x: cubeSize - 1 - coord.y,
                    y: coord.x
                };
            case 0:
                return {
                    x: cubeSize - 1 - coord.x,
                    y: cubeSize - 1 - coord.y,
                };
            case 1:
                return {
                    x: coord.y,
                    y: cubeSize - 1 - coord.x
                };
            default:
                console.log("invalid rotation direction");
                return coord;
        }
    }

    // modifies the face by rotating it.
    // direction is as according to rotCoord.
    rotateFace(face, direction) {
        let newFace = [[]];

        // fill newFace in order
        //   get square by where it would have been before rotation
        //   (get coord, do reverse rotation, get element in face from reverse rotated coord)
        for (let row = 0; row < cubeSize; ++row) {
            newFace[row] = [];
            
            for (let col = 0; col < cubeSize; ++col) {
                let oldCoord = this.rotCoord({ x: row, y: col }, -direction);
                newFace[row][col] = face[oldCoord.x][oldCoord.y];
            }
        }

        face[0][0] = 3;
        // copy?? ? ?
        for (let row = 0; row < cubeSize; ++row) {
            for (let col = 0; col < cubeSize; ++col) {
                face[row][col] = newFace[row][col];
            }
        }
    }

    // rotates a strip: a loop of cubies that goes around the cube
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
            let nextFaceInfo = cubeInfo[faceIndex][direction];
            
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
        this.rotateStrip(cube, faceIndex, depth, direction);

        // if the side rotated is furthest in or out (if on either side)
        // rotate the corresponding face
        if (depth === 0) {
            this.rotateFace(cube[cubeInfo[faceIndex][this.rotDirection(direction, -1)].face], -1);
        } else if (depth === (cubeSize - 1)) {
            this.rotateFace(cube[cubeInfo[faceIndex][this.rotDirection(direction, 1)].face], 1);
        }
    }

    doRotate(faceIndex, depth, direction) {
        let newCube = this.state.cube.slice();
        this.rotate(newCube, faceIndex, depth, direction);

        this.setState(
            { cube: newCube }
        );
    }
    
    // legacy test for colours, returns jsx
    colorTest() {
        return (            
            <React.Fragment>    
                <CubeGridSquare color="green" />
                <CubeGridSquare color="yellow" />
                <CubeGridSquare color="orange" />
                <CubeGridSquare color="red" />
                <CubeGridSquare color="white" />
                <CubeGridSquare color="blue" />
            </React.Fragment>
        );
    }

    render() {
        return <div className="rubiks-cube">
            <form>
                <input 
                    id="face-index" placeholder="face index" name="face index"
                    onInput={
                        () => {
                            // see above comments?
                            this.setState({ 
                                faceIndex: parseInt(document.getElementById("face-index").value) 
                            });
                        }
                    }
                />

                <input 
                    id="depth" placeholder="depth" name="depth"
                    onInput={
                        () => {
                            // maybe there is better way? 
                            // somehowe refer to parent element rather than searching dom
                            this.setState({ 
                                depth: parseInt(document.getElementById("depth").value) 
                            });
                        }
                    }
                />

                <input 
                    id="direction" placeholder="direction" name="direction"
                    onInput={
                        () => {
                            // see above comment?
                            this.setState({ 
                                direction: parseInt(document.getElementById("direction").value) 
                            });
                        }
                    }       
                />
                

            </form>

            <div>
                <button
                    onClick = {
                        () => {
                            console.log("rotating face");
                            let newCube = this.state.cube.slice();
                            // newCube[0] = 
                            let faceIndex, depth, direction = 0;

                            let moveList = [];

                            for (let i = 0; i < 10; ++i) {
                                faceIndex = Math.floor(6 * Math.random());
                                depth = Math.floor(cubeSize * Math.random());
                                direction = Math.floor(4 * Math.random());

                                this.rotate(newCube, faceIndex, depth, direction);

                                moveList[i] = { face: faceIndex, depth: depth, dir: direction };
                            }

                            console.log(moveList);
                            
                            this.setState(
                                { cube: newCube }
                            );
                        }
                    } >
                    shuffle
                </button>

                <button
                    onClick = {
                        () => {
                            console.log("reset");
                            this.reset();
                        }
                    } >
                    reset
                </button>

                <button
                    onClick = {
                        () => {
                            let newCube = this.state.cube.slice();

                            let moves = [ 
                                {face: 1, depth: 2, dir: 2},
                                {face: 4, depth: 1, dir: 3},
                                {face: 0, depth: 2, dir: 2},
                                {face: 2, depth: 1, dir: 3},
                                {face: 5, depth: 2, dir: 3},
                                {face: 0, depth: 1, dir: 2},
                                {face: 3, depth: 0, dir: 2},
                                {face: 2, depth: 2, dir: 3},
                                {face: 3, depth: 1, dir: 3},
                                {face: 4, depth: 0, dir: 1},
                            ]

                            let move = moves[this.state.move];
                            this.rotate(newCube, move.face, move.depth, move.dir);
                            
                            this.setState(
                                { cube: newCube,
                                  move: this.state.move + 1  
                                }
                            );
                        }
                    } >
                    do sequence
                </button>
            </div>
            
            <CubeGrid cube={ this.state.cube } doRotate={ (faceIndex, depth, direction) => { this.doRotate(faceIndex, depth, direction) } } />
        </div>;
        //this.colorTest();
    }
}

export default Cube