/*


// test cubeInfo
() => {
    let newCube = this.state.cube;

    for (let faceIndex = 0; faceIndex < 6; ++faceIndex) {
        for (let j = 0; j < 4; ++j) {
            let faceInfo = cubeInfo[faceIndex][j];
            this.setLine(
                newCube[faceInfo.face], 
                0,
                faceInfo.orient, 
                Array(cubeSize).fill( faceIndex )
            );
        }
        
        this.setState(
            { cube: newCube }
        );
        
        this.forceUpdate();
        this.render();
    }
}


<button
    onClick = {
        () => {
            console.log("rotating face");
            let newCube = this.state.cube.slice();
            // newCube[0] = 
            this.rotate(newCube, this.state.faceIndex, this.state.depth, this.state.direction);
            
            this.setState(
                { cube: newCube }
            );
        }
    } >
    rotate
</button>

<button
    onClick = {
        () => {
            console.log("rotating face");
            let newCube = this.state.cube.slice();
            // newCube[0] = 
            this.setRow(newCube[1], this.state.depth, Array(cubeSize).fill(6));
            
            this.setState(
                { cube: newCube }
            );
        }
    } >
    setRowTest
</button>

<button
    onClick = {
        () => {
            console.log("you must be joking");
            let newCube = this.state.cube.slice();
            // newCube[0] = 
            let newRow = Array(cubeSize).fill(6);
            newRow = newRow.map( (item, index) => (index % 6) );
            
            newRow = [2, 2, 4];

            this.setLine(newCube[1], 1, 3, newRow);
            
            this.setState(
                { cube: newCube }
            );
        }
    } >
    test
</button>
*/