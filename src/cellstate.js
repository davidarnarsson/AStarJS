
/**
An enum representing the state of a cell.

@global CellState

*/
CellState = {
	/**
		The default state of a cell.
	*/
	NORMAL: 1,

	/**
		The cell is a wall
	*/
	WALL: 2,

	/**
		The cell has been explored as a part of a possible path
	*/
	PLOTTING: 3,

	/**
		The cell is a part of a path
	*/
	PATH: 4,

	/**
		The cell is the starting cell from which the search will be conducted.
	*/
	START: 5,

	/**
		The cell is the target cell which the search will be aimed at.
	*/
	TARGET: 6
};
