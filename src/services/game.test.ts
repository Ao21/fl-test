import { Game, GameData } from './game';

const defaultSettings = {
	size: {
		m: 5,
		n: 10,
	},
	direction: 0,
	mines: [
		{
			x: 1,
			y: 1,
		},
	],
	start: {
		x: 0,
		y: 0,
	},
	exit: {
		x: 4,
		y: 4,
	},
};

describe('Setup', () => {
	test('It should be able to create a game board of 5x10', () => {
		const game = new Game(defaultSettings);

		const xLength = game.board.length;
		const yLength = game.board[0].length;

		expect(xLength).toBe(5);
		expect(yLength).toBe(10);
	});

	test('it shouldnt be able to place a mine out of bounds', () => {
		const settings = {
			...defaultSettings,
			mines: [
				{
					x: 55,
					y: 55,
				},
			],
		};
		expect(() => {
			const game = new Game(settings);
		}).toThrow();
	});

	test('it shouldnt be able to place a bad start location', () => {
		const settings = {
			...defaultSettings,
			start: {
				x: 55,
				y: -50,
			},
		};
		expect(() => {
			const game = new Game(settings);
		}).toThrow();
	});

	test('it shouldnt be able to place a bad exit location', () => {
		const settings = {
			...defaultSettings,
			start: {
				x: -150,
				y: -50,
			},
		};
		expect(() => {
			const game = new Game(settings);
		}).toThrow();
	});
});

describe('Game', () => {
	beforeEach(() => {
		jest.spyOn(console, 'log').mockClear();
	});

	test('it should be able to go out of bounds', () => {
		const game = new Game(defaultSettings);
		game.play(['R', 'R', 'R', 'M']);

		expect(console.log).toBeCalledWith('Out of bounds');
	});

	test('it should be able to find a mine', () => {
		const game = new Game(defaultSettings);
		game.play(['R', 'M', 'R', 'M']);

		expect(console.log).toBeCalledWith('Mine');
	});

	test('it should be able to find an exit', () => {
		const game = new Game(defaultSettings);
		game.play(['R', 'M', 'M', 'M', 'M', 'R', 'M', 'M', 'M', 'M']);

		expect(console.log).toBeCalledWith('Succcess');
	});

	test('it should be able to get stuck', () => {
		const game = new Game(defaultSettings);
		game.play(['R']);

		expect(console.log).toBeCalledWith('Still in Danger');
	});
});
