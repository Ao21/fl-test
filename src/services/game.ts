interface Size {
	m: number;
	n: number;
}

export interface GameData {
	size: Size;
	direction: DIRECTION;
	mines: Position[];
	start: Position;
	exit: Position;
}

interface Position {
	x: number;
	y: number;
}

enum MARKER {
	EMPTY = 'O',
	MINE = 'X',
	EXIT = 'E',
}

enum DIRECTION {
	NORTH = 0,
	EAST = 1,
	SOUTH = 2,
	WEST = 3,
}

enum ACTION {
	MOVE = 'M',
	ROTATE = 'R',
}

enum RESULTS {
	OUT_OF_BOUNDS = 0,
	SUCCESS = 1,
	MINE = 2,
	DANGER = 3,
}

export class Game {
	board: any = [];
	xLimit: number;
	yLimit: number;

	currentPosition: Position;
	exitPosition: Position;

	direction: DIRECTION;

	constructor({ size, direction, mines, start, exit }: GameData) {
		this.createBoard(size, start, exit, direction);
		this.addMines(mines);
		this.addExit(exit);
	}

	/**
  * Create Game Board
  * 
  * @param {Position} size 
  * @param {Position} start 
  * @param {Position} exit 
  * @param {DIRECTION} direction 
  * @memberof Game
  */
	createBoard(
		size: Size,
		start: Position,
		exit: Position,
		direction: DIRECTION,
	) {
		this.xLimit = size.m;
		this.yLimit = size.n;

		this.direction = direction || 0;

		this.checkWithinLimits(start);
		this.checkWithinLimits(exit);

		this.currentPosition = start;
		this.exitPosition = exit;

		for (var x = 0; x < size.m; x++) {
			this.board[x] = [];
			for (var y = 0; y < size.n; y++) {
				this.board[x][y] = MARKER.EMPTY;
			}
		}
	}

	/**
  * Check whether position is inside board limits
  * 
  * @param {Position} { x, y } 
  * @param {boolean} [hard=true] 
  * @returns 
  * @memberof Game
  */
	checkWithinLimits({ x, y }: Position, hard = true) {
		if (x < 0 || x >= this.xLimit || y < 0 || y >= this.yLimit) {
			if (hard) {
				throw new Error('Out of bounds');
			}
			return false;
		} else {
			return true;
		}
	}

	/**
  * Add Mines to Gameboard
  * 
  * @param {Position[]} mines 
  * @memberof Game
  */
	addMines(mines: Position[]) {
		mines.forEach(mine => {
			if (this.checkWithinLimits(mine)) {
				this.board[mine.x][mine.y] = MARKER.MINE;
			}
		});
	}

	/**
  * Check if mine exists at this position
  * 
  * @param {Position} position 
  * @returns 
  * @memberof Game
  */
	checkForMine(position: Position) {
		return this.board[position.x][position.y] === MARKER.MINE ? true : false;
	}

	/**
  * Check if exit exists at this position
  * 
  * @param {Position} position 
  * @returns 
  * @memberof Game
  */
	checkForExit(position: Position) {
		return this.board[position.x][position.y] === MARKER.EXIT ? true : false;
	}

	/**
  * Add Exit to the gameboard
  * 
  * @param {Position} exit 
  * @memberof Game
  */
	addExit(exit: Position) {
		if (this.checkWithinLimits(exit)) {
			this.board[exit.x][exit.y] = MARKER.EXIT;
		}
	}

	/**
  * Run through a list of moves and then announce the results
  * 
  * @param {string[]} moves 
  * @memberof Game
  */
	play(moves: string[]) {
		const res = moves.map((m: any) => {
			return this.handleAction(m);
		});

		const final = res.find(item => {
			return item !== RESULTS.DANGER;
		});

		this.announce(final);
	}

	/**
  * Console.log the Result
  * 
  * @param {*} result 
  * @returns 
  * @memberof Game
  */
	announce(result: any) {
		switch (result) {
			case RESULTS.OUT_OF_BOUNDS:
				return console.log('Out of bounds');
			case RESULTS.MINE:
				return console.log('Mine');
			case RESULTS.SUCCESS:
				return console.log('Succcess');
			default:
				return console.log('Still in Danger');
		}
	}

	/**
  * Hande the action for this move
  * 
  * @param {ACTION} move 
  * @returns 
  * @memberof Game
  */
	handleAction(move: ACTION) {
		switch (move) {
			case ACTION.MOVE:
				return this.move();
			case ACTION.ROTATE:
				return this.rotate();
		}
	}

	/**
  * Update the currentPosition
  * 
  * @returns RESULT
  * @memberof Game
  */
	move() {
		switch (this.direction) {
			case DIRECTION.NORTH:
				this.currentPosition = {
					...this.currentPosition,
					y: this.currentPosition.y - 1,
				};
				break;
			case DIRECTION.SOUTH:
				this.currentPosition = {
					...this.currentPosition,
					y: this.currentPosition.y + 1,
				};
				break;
			case DIRECTION.EAST:
				this.currentPosition = {
					...this.currentPosition,
					x: this.currentPosition.x + 1,
				};
				break;
			case DIRECTION.WEST:
				this.currentPosition = {
					...this.currentPosition,
					x: this.currentPosition.x - 1,
				};
				break;
		}

		if (!this.checkWithinLimits(this.currentPosition, false)) {
			return RESULTS.OUT_OF_BOUNDS;
		}

		if (this.checkForMine(this.currentPosition)) {
			return RESULTS.MINE;
		}

		if (this.checkForExit(this.currentPosition)) {
			return RESULTS.SUCCESS;
		}

		return RESULTS.DANGER;
	}

	/**
   * Rotate and set the new direction
   * 
   * @returns RESULT
   * @memberof Game
   */
	rotate() {
		this.direction < 3 ? this.direction++ : (this.direction = 0);
		return RESULTS.DANGER;
	}
}
