(the commennts for the cube-const file are located here)

cube-consts.json is a file for organizing some cube constants

Colors are ordered according to respective numbers, their indices as in CubeConsts.colors
```
      +-+
      |0|
    +-+-+-+
    |1|2|3|
    +-+-+-+
      |4|
      +-+
      |5|
      +-+
```

CubeInfo contains the faces adjacent to the indexth face. This a list of the a list of the then the thne

face 0 is adjacent to faces 5, 3, 2, 1 in that order from top, right, bottom, left
5 shares 0's top row, 3 shares 0's right, 2 - 0's bot, 1 - 0's left
 
face 1's adjacent edge is its top row: (0,0) (1,0) (2, n) etc.
face 2, 3 also adjacent edge top row
face 5 shares its bottom row: (0, n) (1, n) (2, n) etc. 