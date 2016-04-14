import Generator from '../../lib/Generator';

describe('Generator', () => {
	let config, context, compiler, syntax, handlebars, template, generator;

	beforeEach(() => {
		config = {
			options: {
				name: 'test',
				port: 1234
			},
			locations: {
				'/': {
					options: {
						name: 'test',
						port: 1234
					}
				}
			}
		};
		context = () => {
			return {
				lines: [],
				contexts: []
			};
		};
		compiler = () => {
			return {
				compile: () => {
					generator._mainContext.lines.push('test');
				}
			};
		};
		syntax = () => {
			return {
				name: () => {
					return {expressions: [{type: 'Literal', value: 'test'}]};
				},
				port: () => {
					return {expressions: [{type: 'Literal', value: 'test'}]};
				}
			};
		};
		handlebars = {
			compile: () => {
				return () => {
				};
			}
		};
		template = '';
		generator = new Generator(config, context, compiler, syntax, handlebars, template);
	});

	it('should expose the "build" method', () => {
		expect(generator.build).to.be.a.function;
	});

	it('should expose the "output" method', () => {
		expect(generator.output).to.be.a.function;
	});

	describe('build()', () => {
		it('should add lines to the parent context', () => {
			generator.build();
			expect(generator._mainContext.lines.length > 0).to.equal(true);
		});

		it('should call a syntax method for each option in the config options', () => {
			sinon.spy(generator._mainContext.Syntax, 'name');
			sinon.spy(generator._mainContext.Syntax, 'port');
			generator.build();
			expect(generator._mainContext.Syntax.name).to.have.been.called;
			expect(generator._mainContext.Syntax.port).to.have.been.called;
		});

		it('should exit the process if an option is given that isn\'t a syntax method', () => {
			generator._Config.options.invalidParam = 'test';
			expect(() => generator.build()).to.throw();
		});

		describe('when parsing locations', () => {
			it('should create a new child context', () => {
				generator.build();
				expect(generator._mainContext.contexts.length > 0).to.equal(true);
			});
		});
	});

	describe('output()', () => {
		it('should return a string', () => {
			expect(generator.output()).to.be.a.string;
		});

		it('should compile a handlebars template if the template string is not empty', () => {
			sinon.spy(generator._Handlebars, 'compile');
			generator._template = 'test';
			generator.output();
			expect(generator._Handlebars.compile).to.have.been.called;
		});

		it('should compile the handlebars template without escaping the output', () => {
			sinon.spy(generator._Handlebars, 'compile');
			generator._template = 'test';
			generator.output();
			expect(generator._Handlebars.compile).to.have.been.calledWith('test', {noEscape: true});
		});
	});
});