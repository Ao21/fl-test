var MARKER;
(function (MARKER) {
    MARKER["EMPTY"] = "O";
    MARKER["MINE"] = "X";
    MARKER["EXIT"] = "E";
})(MARKER || (MARKER = {}));
var DIRECTION;
(function (DIRECTION) {
    DIRECTION[DIRECTION["NORTH"] = 0] = "NORTH";
    DIRECTION[DIRECTION["EAST"] = 1] = "EAST";
    DIRECTION[DIRECTION["SOUTH"] = 2] = "SOUTH";
    DIRECTION[DIRECTION["WEST"] = 3] = "WEST";
})(DIRECTION || (DIRECTION = {}));
var ACTION;
(function (ACTION) {
    ACTION["MOVE"] = "M";
    ACTION["ROTATE"] = "R";
})(ACTION || (ACTION = {}));
var RESULTS;
(function (RESULTS) {
    RESULTS[RESULTS["OUT_OF_BOUNDS"] = 0] = "OUT_OF_BOUNDS";
    RESULTS[RESULTS["SUCCESS"] = 1] = "SUCCESS";
    RESULTS[RESULTS["MINE"] = 2] = "MINE";
    RESULTS[RESULTS["DANGER"] = 3] = "DANGER";
})(RESULTS || (RESULTS = {}));
export class Game {
    constructor({ size, direction, mines, start, exit }) {
        this.board = [];
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
    createBoard(size, start, exit, direction) {
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
    checkWithinLimits({ x, y }, hard = true) {
        if (x < 0 || x >= this.xLimit || y < 0 || y >= this.yLimit) {
            if (hard) {
                throw new Error('Out of bounds');
            }
            return false;
        }
        else {
            return true;
        }
    }
    /**
    * Add Mines to Gameboard
    *
    * @param {Position[]} mines
    * @memberof Game
    */
    addMines(mines) {
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
    checkForMine(position) {
        return this.board[position.x][position.y] === MARKER.MINE ? true : false;
    }
    /**
    * Check if exit exists at this position
    *
    * @param {Position} position
    * @returns
    * @memberof Game
    */
    checkForExit(position) {
        return this.board[position.x][position.y] === MARKER.EXIT ? true : false;
    }
    /**
    * Add Exit to the gameboard
    *
    * @param {Position} exit
    * @memberof Game
    */
    addExit(exit) {
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
    play(moves) {
        const res = moves.map((m) => {
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
    announce(result) {
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
    handleAction(move) {
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
                this.currentPosition = Object.assign({}, this.currentPosition, { y: this.currentPosition.y - 1 });
                break;
            case DIRECTION.SOUTH:
                this.currentPosition = Object.assign({}, this.currentPosition, { y: this.currentPosition.y + 1 });
                break;
            case DIRECTION.EAST:
                this.currentPosition = Object.assign({}, this.currentPosition, { x: this.currentPosition.x + 1 });
                break;
            case DIRECTION.WEST:
                this.currentPosition = Object.assign({}, this.currentPosition, { x: this.currentPosition.x - 1 });
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
