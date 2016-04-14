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

export default class SyntaxInterface {

	/**
	 * Each method defines the syntax required to write the directives for a particular config option, for
	 * example, the "DocumentRoot" directive requires an identifier - "DocumentRoot" - followed by a literal
	 * - "/web/root". Each method must define it's syntax requirements to fulfill its config option by writing
	 * these requires as syntax objects to be parsed anc compiled later.
	 * <br><br>
	 * The syntax form concrete-syntax-tree like objects, but aren't strictly CTSs, so they don't follow all
	 * the rules.
	 * <br><br>
	 * Each configuration option must have a method with the same name in this interface, each server type
	 * must implement this interface.
	 *
	 * @interface
	 */
	constructor() {
	}

	/**
	 * Syntax corresponding with the options key, being the server name
	 *
	 * @abstract
	 * @returns {Object}
	 */
	name() {
	}

	/**
	 * Syntax corresponding with the "aliases" option
	 *
	 * @abstract
	 * @returns {Object}
	 */
	aliases() {
	}

	/**
	 * Syntax corresponding with the "port" option
	 *
	 * @abstract
	 * @returns {Object}
	 */
	port() {
	}

	/**
	 * Syntax corresponding with the "ssl" options
	 *
	 * @abstract
	 * @returns {Object}
	 */
	ssl() {
	}

	/**
	 * Syntax corresponding with the "accessLog" option
	 *
	 * @abstract
	 * @returns {Object}
	 */
	accessLog() {
	}

	/**
	 * Syntax corresponding with the "errorLog" option
	 *
	 * @abstract
	 * @returns {Object}
	 */
	errorLog() {
	}

	/**
	 * Syntax corresponding with the "root" option
	 *
	 * @abstract
	 * @returns {Object}
	 */
	root() {
	}

	/**
	 * Syntax corresponding with the "fastcgi" option
	 *
	 * @abstract
	 * @returns {Object}
	 */
	fastcgi() {
	}

	/**
	 * Syntax corresponding with the "compress" option
	 *
	 * @abstract
	 * @returns {Object}
	 */
	compress() {
	}

	/**
	 * Syntax corresponding with the "headers.set" and "header.unset" options
	 *
	 * @abstract
	 * @returns {Object}
	 */
	headers() {
	}

	/**
	 * Syntax corresponding with the "serverSignature" option
	 *
	 * @abstract
	 * @returns {Object}
	 */
	serverSignature() {
	}

	/**
	 * Syntax corresponding with the "index" option
	 *
	 * @abstract
	 * @returns {Object}
	 */
	index() {
	}

	/**
	 * Syntax corresponding with the "redirect" option
	 *
	 * @abstract
	 * @returns {Object}
	 */
	redirect() {
	}

	/**
	 * Syntax corresponding with the "listDirectories" option
	 *
	 * @abstract
	 * @returns {Object}
	 */
	listDirectories() {
	}

	/**
	 * Syntax corresponding with the "caching" options
	 *
	 * @abstract
	 * @returns {Object}
	 */
	caching() {
	}

	/**
	 * Syntax corresponding with the "auto" options
	 *
	 * @abstract
	 * @returns {Object}
	 */
	auth() {
	}

	/**
	 * Syntax corresponding with the "proxy" options
	 *
	 * @abstract
	 * @returns {Object}
	 */
	proxy() {
	}
}