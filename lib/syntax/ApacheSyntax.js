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

import SyntaxInterface from './SyntaxInterface';

export default class ApacheSyntax extends SyntaxInterface {

	/**
	 * Defines syntax required specifically for Apache conf directives
	 *
	 * @implements SyntaxInterface
	 * @param {ApacheContext|NginxContext} Context
	 */
	constructor(Context) {
		super();
		this._config = Context.Config.options;
	}

	/**
	 *  @inheritdoc
	 */
	name() {
		return {
			expressions: [
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'ServerName'
					},
					right: {
						type: 'Literal',
						value: this._config.name
					}
				}
			]
		};
	}

	/**
	 *  @inheritdoc
	 */
	aliases() {
		const expression = {
			expressions: []
		};

		(this._config.aliases || []).forEach((alias) => {
			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'ServerAlias'
				},
				right: {
					type: 'Literal',
					value: alias
				}
			});
		});

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	port() {
		return {
			expressions: []
		};
	}

	/**
	 *  @inheritdoc
	 */
	ssl() {
		const expression = {
			expressions: []
		};

		if (this._config.ssl.enable) {
			expression.expressions = [
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'SSLEngine'
					},
					right: {
						type: 'Literal',
						value: 'On'
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'SSLCertificateFile'
					},
					right: {
						type: 'Literal',
						value: this._config.ssl.cert
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'SSLCertificateKeyFile'
					},
					right: {
						type: 'Literal',
						value: this._config.ssl.key
					}
				}
			];
		}

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	accessLog() {
		const expression = {
			expressions: []
		};

		if (this._config.accessLog) {
			expression.expressions = [
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'CustomLog'
					},
					right: {
						type: 'Literal',
						value: this._config.accessLog,
						right: {
							type: 'Literal',
							value: 'combined'
						}
					}
				}
			];
		}

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	errorLog() {
		const expression = {
			expressions: []
		};

		if (this._config.errorLog) {
			expression.expressions = [
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'ErrorLog'
					},
					right: {
						type: 'Literal',
						value: this._config.errorLog
					}
				}
			];
		}

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	root() {
		const expression = {
			expressions: []
		};

		if (this._config.root) {
			expression.expressions = [
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'DocumentRoot'
					},
					right: {
						type: 'Literal',
						value: this._config.root
					}
				}
			];
		}

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	fastcgi() {
		const expression = {
			expressions: []
		};

		if (this._config.fastcgi) {
			expression.expressions = [
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'AddHandler'
					},
					right: {
						type: 'Literal',
						value: 'php5-fcgi',
						right: {
							type: 'Literal',
							value: '.php'
						}
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'Action'
					},
					right: {
						type: 'Literal',
						value: 'php5-fcgi',
						right: {
							type: 'Literal',
							value: '/php5-fcgi'
						}
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'Alias'
					},
					right: {
						type: 'Literal',
						value: '/php5-fcgi',
						right: {
							type: 'Literal',
							value: '/usr/lib/cgi-bin/php5-fcgi'
						}
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'FastCgiExternalServer'
					},
					right: {
						type: 'Literal',
						value: '/usr/lib/cgi-bin/php5-fcgi',
						right: {
							type: 'Literal',
							value: '-host',
							right: {
								type: 'Literal',
								value: '127.0.0.1:9000',
								right: {
									type: 'Literal',
									value: '-pass-header',
									right: {
										type: 'Literal',
										value: 'Authorization'
									}
								}
							}
						}
					}
				},
				{
					type: 'DirectoryBlock',
					directive: '/usr/lib/cgi-bin',
					body: {
						expressions: [
							{
								type: 'AssignmentExpression',
								left: {
									type: 'Identifier',
									value: 'Require'
								},
								right: {
									type: 'Literal',
									value: 'all',
									right: {
										type: 'Literal',
										value: 'granted'
									}
								}
							}
						]
					}
				}
			];
		}

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	compress() {
		const expression = {
			expressions: []
		};

		if (this._config.compress.enable) {
			this._config.compress.types.forEach((type) => {
				expression.expressions.push({
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'AddOutputFilterByType'
					},
					right: {
						type: 'Literal',
						value: 'DEFLATE',
						right: {
							type: 'Literal',
							value: type
						}
					}
				});
			});

			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'Header'
				},
				right: {
					type: 'Literal',
					value: 'set',
					right: {
						type: 'Literal',
						value: 'Vary',
						right: {
							type: 'Literal',
							value: '*'
						}
					}
				}
			});
		}

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	headers() {
		const expression = {
			expressions: []
		};

		for (const header in this._config.headers.set) {
			if (this._config.headers.set.hasOwnProperty(header)) {
				expression.expressions.push({
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'Header'
					},
					right: {
						type: 'Literal',
						value: 'set',
						right: {
							type: 'Literal',
							value: header,
							right: {
								type: 'Literal',
								value: `"${this._config.headers.set[header]}"`
							}
						}
					}
				});
			}
		}

		if (this._config.headers.unset) {
			this._config.headers.unset.forEach((header) => {
				expression.expressions.push({
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'Header'
					},
					right: {
						type: 'Literal',
						value: 'unset',
						right: {
							type: 'Literal',
							value: header
						}
					}
				});
			});
		}

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	serverSignature() {
		return {
			expressions: [
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'ServerSignature'
					},
					right: {
						type: 'Literal',
						value: this._config.serverSignature ? 'On' : 'Off'
					}
				}
			]
		};
	}

	/**
	 *  @inheritdoc
	 */
	index() {
		const expression = {
			expressions: []
		};

		if (this._config.index.length) {
			expression.expressions = [
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'DirectoryIndex'
					},
					right: {
						type: 'Literal',
						value: this._config.index.join(' ')
					}
				}
			];
		}

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	redirect() {
		const expression = {
			expressions: []
		};

		if (this._config.redirect.enable) {
			expression.expressions = [
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'RedirectMatch'
					},
					right: {
						type: 'Literal',
						value: this._config.redirect.permanent ? '301' : '302',
						right: {
							type: 'Literal',
							value: '^(.*)$',
							right: {
								type: 'Literal',
								value: this._config.redirect.to
							}
						}
					}
				}
			];
		}

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	listDirectories() {
		return {
			expressions: [
				{
					type: 'LocationBlock',
					directive: '/',
					body: {
						expressions: [
							{
								type: 'AssignmentExpression',
								left: {
									type: 'Identifier',
									value: 'Options'
								},
								right: {
									type: 'Literal',
									value: this._config.listDirectories ? '+Indexes' : '-Indexes',
									right: {
										type: 'Literal',
										value: '+FollowSymLinks'
									}
								}
							}
						]
					}
				}
			]
		};
	}

	/**
	 *  @inheritdoc
	 */
	caching() {
		const expression = {
			expressions: []
		};

		if (this._config.caching.enable) {
			expression.expressions = [
				{
					type: 'LocationMatchBlock',
					directive: `"\.(${this._config.caching.types.join('|')})$"`,
					body: {
						expressions: [
							{
								type: 'AssignmentExpression',
								left: {
									type: 'Identifier',
									value: 'ExpiresActive'
								},
								right: {
									type: 'Literal',
									value: 'On'
								}
							},
							{
								type: 'AssignmentExpression',
								left: {
									type: 'Identifier',
									value: 'ExpiresDefault'
								},
								right: {
									type: 'Literal',
									value: `"access plus
											${this._config.caching.expires.years} years
											${this._config.caching.expires.months} months
											${this._config.caching.expires.weeks} weeks
											${this._config.caching.expires.days} days
											${this._config.caching.expires.minutes} minutes"`.replace(/\n/g, '')
								}
							}
						]
					}
				}
			];
		}

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	auth() {
		const expression = {
			expressions: []
		};

		if (this._config.auth.enable) {
			expression.expressions = [
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'AuthType'
					},
					right: {
						type: 'Literal',
						value: 'Basic'
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'AuthName'
					},
					right: {
						type: 'Literal',
						value: this._config.auth.message
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'AuthUserFile'
					},
					right: {
						type: 'Literal',
						value: this._config.auth.userFile
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'Require'
					},
					right: {
						type: 'Literal',
						value: 'valid-user'
					}
				}
			];
		}

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	proxy() {
		const expression = {
			expressions: []
		};

		if (this._config.proxy.enable) {
			expression.expressions = [
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'ProxyRequests'
					},
					right: {
						type: 'Literal',
						value: 'Off'
					}
				},
				{
					type: 'ProxyBlock',
					directive: '*',
					body: {
						expressions: [
							{
								type: 'AssignmentExpression',
								left: {
									type: 'Literal',
									value: 'Order'
								},
								right: {
									type: 'Literal',
									value: 'deny,allow'
								}
							}
						]
					}
				},
				{
					type: 'LocationBlock',
					directive: '/',
					body: {
						expressions: [
							{
								type: 'AssignmentExpression',
								left: {
									type: 'Identifier',
									value: 'ProxyPass'
								},
								right: {
									type: 'Literal',
									value: this._config.proxy.to
								}
							},
							{
								type: 'AssignmentExpression',
								left: {
									type: 'Identifier',
									value: 'ProxyPassReverse'
								},
								right: {
									type: 'Literal',
									value: this._config.proxy.to
								}
							}
						]
					}
				}
			];
		}

		return expression;
	}
}