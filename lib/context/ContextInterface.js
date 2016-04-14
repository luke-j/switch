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

export default class ContextInterface {

	/**
	 * Each server context must implement this interface
	 *
	 * @interface
	 */
	constructor() {
	}

	/**
	 * Adds a child context to the (current) parent context
	 *
	 * @abstract
	 * @param {String} directive - The directive to put after the block type, ie. location /some/path, or <Location /some/path>
	 * @param {String} type - The block type, ie. location, Location, Directory, etc.
	 */
	addContext(directive, type) {// eslint-disable-line no-unused-vars
	}
}