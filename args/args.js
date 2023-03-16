const fs = require("fs");

function args() {
	const commandLineArguments = process.argv.slice(2);
	let logging = false;
	let port = 0;
	let directory = "";
	let strList = [];
	let numList = [];

	logging = commandLineArguments.some((ele) => ele === "-l");

	if (commandLineArguments.indexOf("-p") !== -1) {
		port = parseInt(
			commandLineArguments[commandLineArguments.indexOf("-p") + 1]
		);
		if (isNaN(port)) {
			throw new Error("Pass a valid port number after -p");
		}
	}

	const directoryIndex = commandLineArguments.indexOf("-d");
	if (directoryIndex !== -1) {
		if (
			directoryIndex === commandLineArguments.length - 1 ||
			commandLineArguments[directoryIndex + 1].startsWith("-")
		) {
			throw new Error(`No directory path specified after '-d' flag.`);
		}
		directory = commandLineArguments[directoryIndex + 1];
		try {
			fs.accessSync(directory);
		} catch (error) {
			throw new Error(`Directory '${directory}' does not exist.`);
		}
	}

	const strListIndex = commandLineArguments.indexOf("-g");
	if (strListIndex != -1) {
		if (
			strListIndex === strListIndex - 1 ||
			!commandLineArguments[strListIndex + 1]?.includes(",")
		) {
			throw new Error("No list of string after '-g' flag.");
		} else {
			strList = commandLineArguments[strListIndex + 1].split(",");
		}
	}

	const numListIndex = commandLineArguments.indexOf("-n");
	if (numListIndex != -1) {
		if (
			numListIndex === numListIndex - 1 ||
			!commandLineArguments[numListIndex + 1]?.includes(",")
		) {
			throw new Error("No list of string after '-n' flag.");
		} else {
			numList = commandLineArguments[numListIndex + 1].split(",").map((ele) => {
				if (isNaN(parseInt(ele))) {
					throw new Error("Bad input passed after -n");
				}
				return parseInt(ele);
			});
		}
	}

	return [logging, port, directory, strList, numList];
}

module.exports = args;
