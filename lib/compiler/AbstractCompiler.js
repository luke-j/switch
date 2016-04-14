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

import CompilerInterface from './CompilerInterface';

export default class AbstractCompiler extends CompilerInterface {

	/**
	 * The Compiler is responsible for turning syntax expressions into apache or nginx conf
	 *
	 * @implements CompilerInterface
	 * @param {ApacheContext|NginxContext} Context - A Apache/Nginx Context instance
	 */
	constructor(Context) {
		super();
		this._Context = Context;
	}

	/**
	 * @inheritdoc
	 */
	compile(expressions) {
		expressions.forEach(this._compileEach.bind(this));
	}

	/**
	 * Compile an assignment expression, ie. an expression assigning a value to an identifier
	 *
	 * @param {Object} expression - A syntax expression
	 * @protected
	 */
	_assignmentExpression(expression) {
		if (!expression.hasOwnProperty('left') || !expression.hasOwnProperty('right')) {
			throw new Error('Assignment expression must have a left and right-side value');
		}

		this._expression(expression.left);
		this._expression(expression.right);
	}

	/**
	 * Compile an identifier, ie. a known word to apache or nginx, like DocumentRoot or server_name
	 *
	 * @param {Object} expression - A syntax expression
	 * @protected
	 */
	_identifier(expression) {
		if (!expression.hasOwnProperty('value')) {
			throw new Error('Identifier must have a value');
		}

		this._line += expression.value + ' ';

		expression.right && this._expression(expression.right);
	}

	/**
	 * Compile a literal, which can be any string
	 *
	 * @param {Object} expression - A syntax expression
	 * @protected
	 */
	_literal(expression) {
		if (!expression.hasOwnProperty('value')) {
			throw new Error('Literal must have a value');
		}

		this._line += expression.value + ' ';

		expression.right && this._expression(expression.right);
	}

	/**
	 * Compile a variable, which is a pre-determined apache variable which holds a computed value
	 *
	 * @param {Object} expression - A syntax expression
	 * @protected
	 */
	_variable(expression) {
		if (!expression.hasOwnProperty('value')) {
			throw new Error('Literal must have a value');
		}

		this._line += expression.value + ' ';

		expression.right && this._expression(expression.right);
	}

	/**
	 * Transforms expressions into apache/nginx conf
	 *
	 * @param {Object} expression - A syntax expression to be parsed
	 * @private
	 */
	_compileEach(expression) {
		this._line = '';
		this._expression(expression);
		if (this._line) {
			this._Context.lines.push(this._line.trim());
		}
	}
}