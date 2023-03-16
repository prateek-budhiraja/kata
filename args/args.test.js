const args = require("./args");

describe("command line argument parser", () => {
	it("returns [false, 0, ''] if no arguments passed", () => {
		process.argv = ["node-path", "program-path"];
		expect(args()).toEqual([false, 0, "", [], []]);
	});

	it("returns true if only logging is passed", () => {
		process.argv = ["node-path", "program-path", "-l"];
		expect(args()).toEqual([true, 0, "", [], []]);
	});

	it("throws an error if no/wrong value  after -p", () => {
		process.argv = ["node-path", "program-path", "-p"];
		expect(args).toThrow("Pass a valid port number after -p");

		process.argv = ["node-path", "program-path", "-p", "-l", "800"];
		expect(args).toThrow("Pass a valid port number after -p");
	});

	it("returns value that is passed after -p", () => {
		process.argv = ["node-path", "program-path", "-p", "800"];
		expect(args()).toEqual([false, 800, "", [], []]);

		process.argv = ["node-path", "program-path", "-p", "800", "-l"];
		expect(args()).toEqual([true, 800, "", [], []]);

		process.argv = ["node-path", "program-path", "-l", "-p", "800"];
		expect(args()).toEqual([true, 800, "", [], []]);
	});

	it("throws an error if no value/wrong value after -d", () => {
		process.argv = ["node-path", "program-path", "-d"];
		expect(args).toThrow();

		process.argv = ["node-path", "program-path", "-d", "-p", "8000"];
		let expectedError = new Error(
			"No directory path specified after '-d' flag."
		);
		expect(args).toThrow(expectedError);

		process.argv = ["node-path", "program-path", "-d", "nonexistent-directory"];
		expectedError = new Error(
			"Directory 'nonexistent-directory' does not exist."
		);
		expect(args).toThrow(expectedError);

		process.argv = ["node-path", "program-path", "-d", "800"];
		expectedError = new Error("Directory '800' does not exist.");
		expect(args).toThrow(expectedError);
	});

	it("returns value that is passed after -d", () => {
		process.argv = ["node-path", "program-path", "-d", "D:\\git-indi"];
		expect(args()).toEqual([false, 0, "D:\\git-indi", [], []]);

		process.argv = [
			"node-path",
			"program-path",
			"-p",
			"800",
			"-d",
			"D:\\git-indi",
		];
		expect(args()).toEqual([false, 800, "D:\\git-indi", [], []]);

		process.argv = [
			"node-path",
			"program-path",
			"-l",
			"-p",
			"800",
			"-d",
			"D:\\git-indi",
		];
		expect(args()).toEqual([true, 800, "D:\\git-indi", [], []]);

		process.argv = [
			"node-path",
			"program-path",
			"-d",
			"D:\\git-indi",
			"-l",
			"-p",
			"800",
		];
		expect(args()).toEqual([true, 800, "D:\\git-indi", [], []]);
	});

	it("throws an error if no/wrong value passed after -g", () => {
		process.argv = ["node-path", "program-path", "-g"];
		let expectedError = new Error("No list of string after '-g' flag.");
		expect(args).toThrow(expectedError);

		process.argv = ["node-path", "program-path", "-g", "-l"];
		expectedError = new Error("No list of string after '-g' flag.");
		expect(args).toThrow(expectedError);

		process.argv = [
			"node-path",
			"program-path",
			"-g",
			"-l",
			"-d",
			"D:\\git-indi",
		];
		expectedError = new Error("No list of string after '-g' flag.");
		expect(args).toThrow(expectedError);
	});

	it("returns list of string after -g", () => {
		process.argv = [
			"node-path",
			"program-path",
			"-g",
			"apple,banana,cherry,pear",
		];
		expect(args()).toEqual([
			false,
			0,
			"",
			["apple", "banana", "cherry", "pear"],
			[],
		]);

		process.argv = [
			"node-path",
			"program-path",
			"-l",
			"-g",
			"apple,banana,cherry,pear",
			"-p",
			"8000",
			"-d",
			"D:\\git-indi",
		];
		expect(args()).toEqual([
			true,
			8000,
			"D:\\git-indi",
			["apple", "banana", "cherry", "pear"],
			[],
		]);
	});

	it("throws an error if no/wrong value passed after -n", () => {
		process.argv = ["node-path", "program-path", "-n"];
		let expectedError = new Error("No list of string after '-n' flag.");
		expect(args).toThrow(expectedError);

		process.argv = ["node-path", "program-path", "-n", "-l"];
		expect(args).toThrow(expectedError);

		process.argv = ["node-path", "program-path", "-p", "8000", "-n", "-l"];
		expect(args).toThrow(expectedError);

		process.argv = [
			"node-path",
			"program-path",
			"-n",
			"-l",
			"-d",
			"D:\\git-indi",
		];
		expect(args).toThrow(expectedError);

		expectedError = new Error("Bad input passed after -n");
		process.argv = ["node-path", "program-path", "-n", "12,apple,0", "-l"];
		expect(args).toThrow(expectedError);
	});

	it("returns list of numbers after -n", () => {
		process.argv = ["node-path", "program-path", "-n", "10,12,9,5,16"];
		expect(args()).toEqual([false, 0, "", [], [10, 12, 9, 5, 16]]);

		process.argv = [
			"node-path",
			"program-path",
			"-l",
			"-n",
			"10,12,9,5,16",
			"-p",
			"8000",
			"-d",
			"D:\\git-indi",
		];
		expect(args()).toEqual([
			true,
			8000,
			"D:\\git-indi",
			[],
			[10, 12, 9, 5, 16],
		]);
	});
});
