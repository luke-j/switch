import Config from '../../../lib/Config';
import NginxSyntax from '../../../lib/syntax/NginxSyntax';

describe('NginxSyntax', () => {
	let config, syntax, conf;

	beforeEach(() => {
		conf = {
			name: 'test',
			ssl: {
				enable: true,
				cert: 'test',
				key: 'test'
			},
			port: 1234,
			aliases: ['test'],
			accessLog: 'test',
			errorLog: 'test',
			root: 'test',
			index: ['test'],
			fastcgi: true,
			serverSignature: true,
			listDirectories: true,
			compress: {
				enable: true
			},
			caching: {
				enable: true
			},
			redirect: {
				enable: true
			},
			proxy: {
				enable: true
			},
			headers: {
				set: {
					test: 1
				},
				unset: ['test']
			},
			auth: {
				enable: true
			}
		};
		config = new Config('test', 'test', conf);
		syntax = new NginxSyntax({Config: config});
	});

	it('should expose a method for each option in the config object', () => {
		for (const option in conf) {
			expect(syntax[option]).to.be.a.function;
		}
	});

	it('should return an object with the "expressions" property from each property', () => {
		for (const option in conf) {
			expect(syntax[option]().expressions).to.exist;
		}
	});

	it('should have syntax with the correct format', () => {
		function checkValidity(expression) {
			switch (expression.type) {
				case 'AssignmentExpression':
					expect(expression.left).to.exist;
					expect(expression.right).to.exist;
					checkValidity(expression.left);
					checkValidity(expression.right);
					break;
				case 'Identifier':
					expect(expression.value).to.not.be.undefined;
					break;
				case 'Literal':
					expect(expression.value).to.not.be.undefined;
					expression.right && checkValidity(expression.right);
					break;
				case 'LocationBlock':
					expect(expression.directive).to.exist;
					expect(expression.body).to.exist;
					expect(expression.body.expressions).to.exist;
					expression.body.expressions.forEach(checkValidity);
					break;
				case 'Include':
					expect(expression.file).to.exist;
					break;
				case 'Variable':
					expect(expression.value).to.not.be.undefined;
					expression.right && checkValidity(expression.right);
					break;
				default:
					throw new Error('Invalid type');
			}
		}

		for (const option in conf) {
			syntax[option]().expressions.forEach(checkValidity);
		}
	});
});
