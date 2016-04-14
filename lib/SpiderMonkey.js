/**
 * @license
 *
 * Copyright 2016- Luke Jones (https://github.com/luke-j)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Provides a facade over the SpiderMonkey global functions/arrays.
 * If these methods are called outside of the SpiderMonkey shell, they will fail gracefully
 *
 * @namespace SpiderMonkey
 */
export default class SpiderMonkey {

	/**
	 * Used to access an array of environment variables
	 *
	 * @memberof SpiderMonkey
	 * @static
	 * @returns {Array}
	 */
	static environment() {
		return typeof environment !== 'undefined' ? environment : [];
	}

	/**
	 * Used to access the arguments passed to the JS shell
	 *
	 * @static
	 * @returns {Array}
	 */
	static scriptArgs() {
		return typeof scriptArgs !== 'undefined' ? scriptArgs : [];
	}

	/**
	 * Print a message to the console
	 *
	 * @static
	 * @param {String} [message=''] - The message to be printed to the console
	 */
	static print(message = '') {
		typeof print === 'function' && print(message);
	}

	/**
	 * Read a file and return it's contents
	 *
	 * @static
	 * @param {String} [message=null] - A file path
	 * @returns {Boolean|String} The file contents, or false if unsuccessful
	 */
	static read(file = null) {
		return typeof read === 'function' && read(file);
	}

	/**
	 * Exit the JS shell process
	 *
	 * @static
	 * @param {Integer} [exit=0] - The exit code, non-zero indicating errors
	 */
	static quit(exit = 0) {
		typeof quit === 'function' && quit(exit);

		if(exit > 0) {
			throw new Error();
		}
	}
}