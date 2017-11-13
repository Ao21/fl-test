import { Game } from './services/game';
import { data } from './data/game';
import { moves } from './data/moves';

export class App {
	game: Game;
	constructor() {
		this.game = new Game(data);
		this.game.play(moves);
	}
}

const app = new App();
