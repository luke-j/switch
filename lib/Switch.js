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

import To from './commands/To';
import SpiderMonkey from './SpiderMonkey';

export default class Switch {

	/**
	 * Parse the CLI arguments and run the Switch process
	 *
	 * @constructor Switch
	 */
	constructor() {
	}

	/**
	 * Parse the CLI arguments and run the command specified by the --command parameter
	 *
	 * @param {Array} scriptArgs - The CLI passed to the JS shell
	 */
	static main(scriptArgs = []) {
		const args = {};
		for (let x = 0, length = scriptArgs.length; x < length; x += 2) {
			args[scriptArgs[x].replace(/^\-{2}/, '')] = scriptArgs[x + 1];
		}

		if (!args.command) {
			SpiderMonkey.print('You must specify a "--command" option');
			SpiderMonkey.quit(1);
		}

		switch (args.command) {
			case 'to':
				if (!args.to) {
					SpiderMonkey.print('You must specify a "--to" option');
					SpiderMonkey.quit(1);
				} else if (!args.config) {
					SpiderMonkey.print('You must specify a "--config" option');
					SpiderMonkey.quit(1);
				}
				// SWITCH_SOURCE refers to the Switch source directory
				const run = new To(args.to, SpiderMonkey.read(args.config), SpiderMonkey.environment()['SWITCH_SOURCE']).generate();
				SpiderMonkey.print(run);
				SpiderMonkey.quit();
				break;
			default:
				SpiderMonkey.print('Invalid command');
				SpiderMonkey.quit(1);
				break;
		}
	}
}

// only execute main() if in the SpiderMonkey environment, version is a SpiderMonkey global function
typeof version === 'function' && Switch.main(SpiderMonkey.scriptArgs());
