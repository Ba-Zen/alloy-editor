/**
 * Verifies that the built "dist" file has the correct version number.
 */

const fs = require('fs');
const path = require('path');

/**
 * Built file in which we'll check for the correct version number.
 *
 * We just check one (non-minified) file and assume that if one file is right,
 * the build must be up-to-date.
 */
const BASENAME = 'alloy-editor-all.js';
const FILE = path.join(__dirname, '..', '..', 'dist', 'alloy-editor', BASENAME);

/**
 * String that we search for in order to locate the part of the file where we
 * expect to find the version number.
 */
const SENTINEL = 'scripts/build/version.js';

/**
 * Pattern that we use to extract the version number that follows the SENTINEL.
 */
const MATCH_PATTERN = /\bmodule\.exports\s*=\s*["']([^"']+)["']\s*;/;

/**
 * The number of lines we will search past the SENTINEL before giving up on
 * finding the version number.
 */
const SEARCH_FUZZ = 10;

function log(...args) {
	// eslint-disable-next-line no-console
	console.log(...args);
}

function check() {
	if (!fs.existsSync(FILE)) {
		throw new Error(`File ${FILE} does not exist`);
	}

	const {version} = require('../../package.json');

	log(
		`🔍 Checking ${BASENAME} for presence of version identifier: ${version}`
	);

	const contents = fs.readFileSync(FILE).toString();
	const lines = contents.split(/[\r\n]/);
	const searchStart = lines.findIndex(line => {
		return line.indexOf(SENTINEL) !== -1;
	});

	if (searchStart === -1) {
		throw new Error(`Failed to find sentinel in ${FILE}`);
	}

	for (let i = searchStart, max = searchStart + SEARCH_FUZZ; i < max; i++) {
		const line = lines[i];
		const match = line.match(MATCH_PATTERN);
		if (match) {
			const actualVersion = match[1];
			if (actualVersion !== version) {
				throw new Error(
					`Expected to find version ${version} in ${FILE} but found ${actualVersion}`
				);
			} else {
				log(`✅ Found version ${version} in ${BASENAME}`);
				return;
			}
		}
	}

	throw new Error(`Failed to find version string in ${FILE}`);
}

check();
