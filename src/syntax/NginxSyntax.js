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

export default class NginxSyntax extends SyntaxInterface {

	/**
	 * Defines syntax required specifically for Nginx conf directives
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
						value: 'server_name'
					},
					right: {
						type: 'Literal',
						value: this._config.name,
						right: {
							type: 'Literal',
							value: this._config.aliases && this._config.aliases.join(' ')
						}
					}
				}
			]
		};
	}

	/**
	 *  @inheritdoc
	 */
	aliases() {
		return {
			expressions: []
		}
	}

	/**
	 *  @inheritdoc
	 */
	port() {
		const expression = {
			expressions: [
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'listen'
					},
					right: {
						type: 'Literal',
						value: this._config.port
					}
				}
			]
		};

		if (this._config.ssl.enable) {
			expression.expressions[0].right.right = {
				type: 'Literal',
				value: 'ssl'
			};
		}

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	ssl() {
		const expression = {
			expressions: []
		};

		if (this._config.ssl.enable) {
			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'ssl_certificate'
				},
				right: {
					type: 'Literal',
					value: this._config.ssl.cert
				}
			});
			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'ssl_certificate_key'
				},
				right: {
					type: 'Literal',
					value: this._config.ssl.key
				}
			});
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

		if (this._config.accessLog !== null) {
			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'access_log'
				},
				right: {
					type: 'Literal',
					value: this._config.accessLog
				}
			});
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

		if (this._config.errorLog !== null) {
			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'error_log'
				},
				right: {
					type: 'Literal',
					value: this._config.errorLog
				}
			});
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

		if (this._config.root !== null) {
			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'root'
				},
				right: {
					type: 'Literal',
					value: this._config.root
				}
			});
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
			expression.expressions.push({
				type: 'LocationBlock',
				directive: '~ \.php$',
				body: {
					expressions: [
						{
							type: 'AssignmentExpression',
							left: {
								type: 'Identifier',
								value: 'fastcgi_split_path_info'
							},
							right: {
								type: 'Literal',
								value: '^(.+\.php)(/.+)$'
							}
						},
						{
							type: 'AssignmentExpression',
							left: {
								type: 'Identifier',
								value: 'fastcgi_pass'
							},
							right: {
								type: 'Literal',
								value: 'unix:/var/run/php5-fpm.sock'
							}
						},
						{
							type: 'AssignmentExpression',
							left: {
								type: 'Identifier',
								value: 'fastcgi_index'
							},
							right: {
								type: 'Literal',
								value: 'index.php'
							}
						},
						{
							type: 'Include',
							file: 'fastcgi_params'
						}
					]
				}
			});
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

		expression.expressions.push({
			type: 'AssignmentExpression',
			left: {
				type: 'Identifier',
				value: 'gzip'
			},
			right: {
				type: 'Literal',
				value: this._config.compress.enable ? 'on' : 'off'
			}
		});

		if (this._config.compress.enable) {
			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'gzip_http_version'
				},
				right: {
					type: 'Literal',
					value: '1.1'
				}
			});

			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'gzip_proxied'
				},
				right: {
					type: 'Literal',
					value: 'any'
				}
			});

			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'gzip_types'
				},
				right: {
					type: 'Literal',
					value: this._config.compress.types.join(' ')
				}
			});

			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'gzip_vary'
				},
				right: {
					type: 'Literal',
					value: 'on'
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

		if (this._config.headers.set !== null) {
			for (const header in this._config.headers.set) {
				if (this._config.headers.set.hasOwnProperty(header)) {
					expression.expressions.push({
						type: 'AssignmentExpression',
						left: {
							type: 'Identifier',
							value: 'add_header'
						},
						right: {
							type: 'Literal',
							value: header,
							right: {
								type: 'Literal',
								value: `"${this._config.headers.set[header]}"`
							}
						}
					});
				}
			}
		}

		if (this._config.headers.unset !== null) {
			this._config.headers.unset.forEach((header) => {
				expression.expressions.push({
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'add_header'
					},
					right: {
						type: 'Literal',
						value: header,
						right: {
							type: 'Literal',
							value: `""`
						}
					}
				})
			});
		}

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	serverSignature() {
		const expression = {
			expressions: []
		};

		expression.expressions.push({
			type: 'AssignmentExpression',
			left: {
				type: 'Identifier',
				value: 'server_tokens'
			},
			right: {
				type: 'Literal',
				value: this._config.serverSignature ? 'on' : 'off'
			}
		});

		return expression;
	}

	/**
	 *  @inheritdoc
	 */
	index() {
		const expression = {
			expressions: []
		};

		if (this._config.index.length) {
			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'index'
				},
				right: {
					type: 'Literal',
					value: this._config.index.join(' ')
				}
			});
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
			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'return'
				},
				right: {
					type: 'Literal',
					value: this._config.redirect.permanent ? '301' : '302',
					right: {
						type: 'Literal',
						value: this._config.redirect.to
					}
				}
			});
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
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'autoindex'
					},
					right: {
						type: 'Literal',
						value: this._config.listDirectories ? 'on' : 'off'
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
			},
			minutesInOneYear = 525600;
		let expires = 0;

		if (this._config.caching.enable) {
			expires += this._config.caching.expires.years * minutesInOneYear;
			expires += this._config.caching.expires.months * minutesInOneYear / 12;
			expires += this._config.caching.expires.weeks * minutesInOneYear / 52;
			expires += this._config.caching.expires.days * minutesInOneYear / 365;
			expires += this._config.caching.expires.minutes;

			expression.expressions.push({
				type: 'LocationBlock',
				directive: `~* \.(?:${this._config.caching.types.join('|')}$`,
				body: {
					expressions: [
						{
							type: 'AssignmentExpression',
							left: {
								type: 'Identifier',
								value: 'expires'
							},
							right: {
								type: 'Literal',
								value: `${expires}m`
							}
						},
						{
							type: 'AssignmentExpression',
							left: {
								type: 'Identifier',
								value: 'add_header'
							},
							right: {
								type: 'Literal',
								value: 'Cache-Control',
								right: {
									type: 'Literal',
									value: '"public"'
								}
							}
						}
					]
				}
			});
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
			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'auth_basic'
				},
				right: {
					type: 'Literal',
					value: this._config.auth.message
				}
			});

			expression.expressions.push({
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'auth_basic_user_file'
				},
				right: {
					type: 'Literal',
					value: this._config.auth.userFile
				}
			});
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
						value: 'proxy_pass'
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
						value: 'proxy_cache_valid'
					},
					right: {
						type: 'Literal',
						value: 'any',
						right: {
							type: 'Literal',
							value: '0'
						}
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'proxy_set_header'
					},
					right: {
						type: 'Literal',
						value: 'Host',
						right: {
							type: 'Variable',
							value: '$host'
						}
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'proxy_set_header'
					},
					right: {
						type: 'Literal',
						value: 'X-Forwarded-Proto',
						right: {
							type: 'Variable',
							value: '$scheme'
						}
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'proxy_set_header'
					},
					right: {
						type: 'Literal',
						value: 'X-Forwarded-For',
						right: {
							type: 'Variable',
							value: '$proxy_add_x_forwarded_for'
						}
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'proxy_set_header'
					},
					right: {
						type: 'Literal',
						value: 'X-Real-IP',
						right: {
							type: 'Variable',
							value: '$remote_addr'
						}
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'proxy_http_version'
					},
					right: {
						type: 'Literal',
						value: '1.1'
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'proxy_set_header'
					},
					right: {
						type: 'Literal',
						value: 'Upgrade',
						right: {
							type: 'Variable',
							value: '$http_upgrade'
						}
					}
				},
				{
					type: 'AssignmentExpression',
					left: {
						type: 'Identifier',
						value: 'proxy_set_header'
					},
					right: {
						type: 'Literal',
						value: 'Connection',
						right: {
							type: 'Literal',
							value: '"upgrade"'
						}
					}
				}
			];
		}

		return expression;
	}
}