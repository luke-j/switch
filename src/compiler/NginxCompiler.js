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

import AbstractCompiler from './AbstractCompiler';

export default class NginxCompiler extends AbstractCompiler {

	/**
	 * Compilations required specifically for nginx conf
	 *
	 * @implements CompilerInterface
	 * @extends AbstractCompiler
	 * @param {ApacheContext|NginxContext} Context - A Apache/Nginx Context instance
	 */
	constructor(Context) {
		super(Context);
	}

	/**
	 * Parse and compile a single syntax expression into nginx conf
	 *
	 * @abstract
	 * @protected
	 * @param {Object} expression - A single syntax expression to compile
	 * @returns {string}
	 */
	_expression(expression) {
		if (!expression.hasOwnProperty('type')) {
			throw new Error('Expression must have a type');
		}

		switch (expression.type) {
			case 'AssignmentExpression':
				this._assignmentExpression(expression);
				break;
			case 'Identifier':
				this._identifier(expression);
				break;
			case 'Literal':
				this._literal(expression);
				break;
			case 'LocationBlock':
				this._generateBlockStatement(expression);
				break;
			case 'Include':
				this._include(expression);
				break;
			case 'Variable':
				this._variable(expression);
				break;
			default:
				break;
		}

		return this._line;
	}

	/**
	 * Compile a Block Statement, like a location block
	 *
	 * @param {Object} expression - A syntax expression
	 * @param {String} type - The type of context being created, ie. location
	 * @protected
	 */
	_generateBlockStatement(expression, type) {
		if (!expression.hasOwnProperty('directive') || !expression.hasOwnProperty('body')) {
			throw new Error('Directory block requires a directive and a body');
		}

		const childContext = this._Context.addContext(expression.directive, type),
			compiler = new NginxCompiler(childContext);

		compiler.compile(expression.body.expressions);
	}

	/**
	 * Compile a directive to include another file
	 *
	 * @param {Object} expression - A syntax expression
	 * @protected
	 */
	_include(expression) {
		if (!expression.hasOwnProperty('file')) {
			throw new Error('Include requires a parameter');
		}

		this._line += 'include ' + expression.file;
	}
}