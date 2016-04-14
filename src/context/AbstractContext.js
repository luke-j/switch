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

import ContextInterface from './ContextInterface';

export default class AbstractContext extends ContextInterface {

	/**
	 * Context holds all the information about particular block: it's <i>directive</i>, it's lines, it's child contexts,
	 * as well as it's syntax and compiler instances.
	 *
	 * @implements ContextInterface
	 * @param {String} directive - The directive to put after the block type, ie. location /some/path, or <Location /some/path>
	 * @param {String} type - The block type, ie. location, Location, Directory, etc.
	 * @property {Config} Config - A config instance
	 * @property {ApacheSyntax|NginxSyntax} Syntax - An apache/nginx Syntax instance
	 * @property {ApacheCompiler|NginxCompiler} Compiler - An apache/nginx Compiler instance
	 */
	constructor(directive, type) {
		super();
		this.directive = directive;
		this.type = type;
		this.contexts = [];
		this.lines = [];
		this.Config;
		this.Syntax;
		this.Compiler;
	}
}