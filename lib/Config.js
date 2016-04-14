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

export default class Config {

	/**
	 * Merges the options given with default options, and adds anything needed into the config object
	 *
	 * @constructor Config
	 * @param {String} type - The "use" parameter, ie. nginx, apache
	 * @param {String} server - The server name, given as the first object key in the config file
	 * @param {Object} config - The config options under the server name
	 * @property {Object} options - The processed config options
	 * @property {Object} locations - The processed config options under each location specified
	 * @property {String} type - The server type, ie. nginx
	 */
	constructor(type, server, config) {
		this._defaults = {
			name: server,
			ssl: {
				enable: false,
				cert: null,
				key: null
			},
			port: 80,
			aliases: [],
			accessLog: null,
			errorLog: null,
			root: null,
			index: [],
			fastcgi: false,
			serverSignature: true,
			listDirectories: false,
			compress: {
				enable: false,
				types: ['text/plain']
			},
			caching: {
				enable: false,
				types: ['html'],
				expires: {
					years: 0,
					months: 0,
					weeks: 0,
					days: 0,
					minutes: 0
				}
			},
			auth: {
				enable: false,
				message: 'Restricted',
				userFile: null
			},
			headers: {
				set: null,
				unset: []
			},
			proxy: {
				enable: false,
				to: null
			},
			redirect: {
				enable: false,
				permanent: true,
				to: null
			}
		};
		this._config = config;
		this.type = type;
		this.options = this._deepAssign(this._defaults, this._config, {});
		this.locations = this._parseLocations(this.options);
	}

	/**
	 * Recursively merge two objects, with the source object taking precedence over the target object
	 *
	 * @param {Object} target - Object to merge with "source"
	 * @param {Object} source - The object to merge with "target", taking precedence over the "target" object
	 * @returns {Object}
	 * @private
	 */
	_deepAssign(target, source) {
		const deeplyAssigned = {};
		for (const option in target) {
			if (target.hasOwnProperty(option)) {
				if (source.hasOwnProperty(option)) {
					if (target[option] !== null && typeof target[option] === 'object' && target[option].constructor !== Array) {
						deeplyAssigned[option] = this._deepAssign(target[option], source[option]);
					} else {
						deeplyAssigned[option] = source[option];
					}
				} else {
					deeplyAssigned[option] = target[option];
				}
			}
		}

		// assign any properties present in source but absent in target
		for (const option in source) {
			if (source.hasOwnProperty(option)) {
				if (!deeplyAssigned.hasOwnProperty(option)) {
					deeplyAssigned[option] = source[option];
				}
			}
		}

		return deeplyAssigned;
	}

	/**
	 * Parse the config object, making new objects of any property that starts with a slash and is an object - indicating a location
	 *
	 * @param {Object} config
	 * @returns {Object}
	 * @private
	 */
	_parseLocations(config) {
		const locations = {};
		for (const option in config) {
			if (config.hasOwnProperty(option)) {
				// locations must be objects
				if (config[option] !== null && typeof config[option] === 'object' && config[option].constructor !== Array) {
					const match = option.match(/^\//g);
					if (match) {
						locations[option] = {
							options: config[option]
						};
						delete this.options[option];
					}
				}
			}
		}

		return locations;
	}
}