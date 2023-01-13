// a file for organizing some cube constants
const consts = {
    defaultCubeSize: 3,

    defaultColors: [
        "#eae032", // yellow
        "#F82039", // red
        "#00E05F", // green
        
        "#FFA810",  //orange
        "#D0D0E0", // white
        "#0068F0", // blue

        "#000000", // black
    ],

    /* 
    ABOUT DIRECTIONS:
    
    directions are:
    0: up
    1: right
    2: down
    3: left
    */

    // which faces are adjacent to which and their relative orientation:

    // this data could be stored in a 6x6 2d array but this is faster (i hope)
    //   access since its laid out in a more useful way and its easier? to read (debatable)
    cubeInfo: [
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
    ],

    nonCenterMoves: [
        {}
    ]
}

export default consts;