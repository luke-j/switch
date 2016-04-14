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

import SpiderMonkey from './SpiderMonkey';

export default class Generator {

	/**
	 * Builds a conf string to be placed into an nginx.conf or apache.conf file
	 *
	 * @param {Config} Config - A config instance
	 * @param {ApacheContext|NginxContext} Context - An uninitialised Context instance
	 * @param {ApacheCompiler|NginxCompiler} Compiler - An uninitialised Compiler instance
	 * @param {ApacheSyntax|NginxSyntax} Syntax - An uninitialised Syntax instance
	 * @param {Handlebars} Handlebars - An instance of Handlebars
	 * @param {String} template - A pre-compiled handlebars template
	 */
	constructor(Config, Context, Compiler, Syntax, Handlebars, template) {
		this._Config = Config;
		this._Context = Context;
		this._Compiler = Compiler;
		this._Syntax = Syntax;
		this._Handlebars = Handlebars;
		this._template = template;

		this._mainContext = new this._Context(this._Config.type === 'apache' && `*:${this._Config.options.port}`);
		this._mainContext.Config = this._Config;
		this._mainContext.Syntax = new this._Syntax(this._mainContext);
		this._mainContext.Compiler = new this._Compiler(this._mainContext);
	}

	/**
	 * Compile the necessary syntax and location contexts
	 *
	 * @returns {Generator}
	 */
	build() {
		this._compileMainBlock();

		for (const location in this._mainContext.Config.locations) {
			if (this._mainContext.Config.locations.hasOwnProperty(location)) {
				this._compileLocationBlock(location, this._mainContext.Config.locations[location]);
			}
		}

		return this;
	}

	/**
	 * Output the compiled string, ready to be placed into a .conf file
	 *
	 * @returns {String}
	 */
	output() {
		if (this._template) {
			const template = this._Handlebars.compile(this._template, {noEscape: true});

			return template({
				context: this._mainContext
			});
		}

		return '';
	}

	/**
	 * Compile the main context of the .conf file, either the server or VirtualHost block
	 *
	 * @private
	 */
	_compileMainBlock() {
		this._compileContext(this._mainContext);
	}

	/**
	 * Compile a child context, ie. location, Directory, Proxy, etc.
	 *
	 * @param {String} path - The path (or directive) of the specified location
	 * @param {Object} config - The config options under this location
	 * @private
	 */
	_compileLocationBlock(path, config) {
		const locationContext = new this._Context(path);
		locationContext.Config = config;
		locationContext.Syntax = new this._Syntax(locationContext);
		locationContext.Compiler = new this._Compiler(locationContext);

		this._compileContext(locationContext);
		this._mainContext.contexts.push(locationContext);
	}

	/**
	 * Compile a specified context, iterating over the necessary expressions and compiling each one
	 *
	 * @param {Context} context - The context to compile
	 * @private
	 */
	_compileContext(context) {
		for (const option in context.Config.options) {
			if (context.Config.options.hasOwnProperty(option)) {
				if (typeof context.Syntax[option] !== 'function') {
					SpiderMonkey.print(`Invalid option "${option}"`);
					SpiderMonkey.quit(1);
				}

				context.Compiler.compile(context.Syntax[option]().expressions);
			}
		}
	}
}