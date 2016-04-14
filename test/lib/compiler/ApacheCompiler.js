import ApacheCompiler from '../../../src/compiler/ApacheCompiler';

describe('ApacheCompiler', () => {
	let context, compiler, expressions;

	beforeEach(() => {
		context = {
			lines: [],
			contexts: [],
			addContext: () => {
				const childContext = {
					lines: [],
					contexts: []
				};

				context.contexts.push(childContext);

				return childContext;
			}
		};
		expressions = [
			{
				type: 'AssignmentExpression',
				left: {
					type: 'Identifier',
					value: 'test-1'
				},
				right: {
					type: 'Literal',
					value: 'test-2',
					right: {
						type: 'Variable',
						value: 'test-3'
					}
				}
			},
			{
				type: 'LocationBlock',
				directive: 'test-4',
				body: {
					expressions: [
						{
							type: 'AssignmentExpression',
							left: {
								type: 'Identifier',
								value: 'test-5'
							},
							right: {
								type: 'Variable',
								value: 'test-6'
							}
						}
					]
				}
			}
		];
		compiler = new ApacheCompiler(context);
	});

	it('should expose the "compile" method', () => {
		expect(compiler.compile).to.be.a.function;
	});

	describe('compile()', () => {
		//this method does not include the expressions in child contexts
		it('should call the "_expression" method for each expression', () => {
			sinon.spy(compiler, '_expression');
			compiler.compile(expressions);
			expect(compiler._expression.callCount).to.equal(5);
		});

		it('should add compiled lines to the Context', () => {
			compiler.compile(expressions);

			expect(context.lines.length).to.equal(1);
		});

		it('should correctly compile lines', () => {
			compiler.compile(expressions);

			expect(context.lines).to.deep.equal(['test-1 test-2 test-3'])
		});

		it('should not leave trailing space on lines', () => {
			compiler.compile(expressions);

			expect(/ $/.test(context.lines[0])).to.equal(false);
		});

		it('should throw an error if an expression is missing a "type"', () => {
			sinon.spy(compiler, '_expression');
			delete expressions[0].type;
			expect(compiler._expression.bind(compiler, expressions[0])).to.throw();
		});

		it('should do nothing if the "type" is invalid', () => {
			expressions[0].type = 'test-invalid';
			delete expressions[1];
			compiler.compile(expressions);
			expect(context.lines.length).to.deep.equal(0)
		});

		describe('when compiling "Block" expressions', () => {
			beforeEach(() => {
				sinon.spy(context, 'addContext');
			});

			it('should create a new child context for "LocationBlock" statements', () => {
				compiler.compile(expressions);
				expect(context.addContext).to.have.been.called;
			});

			it('should create a new child context for "LocationMatchBlock" statements', () => {
				expressions[1].type = 'LocationMatchBlock'
				compiler.compile(expressions);
				expect(context.addContext).to.have.been.called;
			});

			it('should create a new child context for "ProxyBlock" statements', () => {
				expressions[1].type = 'ProxyBlock'
				compiler.compile(expressions);
				expect(context.addContext).to.have.been.called;
			});

			it('should create a new child context for "DirectoryBlock" statements', () => {
				expressions[1].type = 'DirectoryBlock'
				compiler.compile(expressions);
				expect(context.addContext).to.have.been.called;
			});

			it('should throw an error if "Block" statements are missing a "directive" property', () => {
				delete expressions[1].directive;
				expect(() => compiler.compile(expressions)).to.throw(Error);
			});

			it('should throw an error if "Block" statements are missing a "body" property', () => {
				delete expressions[1].body;
				expect(() => compiler.compile(expressions)).to.throw(Error);
			});
		});

		describe('when compiling "AssignmentExpressions"', () => {
			it('should throw an error if the expression is missing a "left" property', () => {
				delete expressions[0].left;
				expect(() => compiler.compile(expressions)).to.throw(Error);
			});

			it('should throw an error if the expression is missing a "right" property', () => {
				delete expressions[0].right;
				expect(() => compiler.compile(expressions)).to.throw(Error);
			});
		});

		describe('when compiling a "Literal"', () => {
			it('should throw an error if the expression is missing a "value" property', () => {
				delete expressions[0].right.value;
				expect(() => compiler.compile(expressions)).to.throw(Error);
			});
		});

		describe('when compiling an "Identifier"', () => {
			it('should throw an error if the expression is missing a "value" property', () => {
				delete expressions[0].left.value;
				expect(() => compiler.compile(expressions)).to.throw(Error);
			});
		});

		describe('when compiling a "Variable"', () => {
			it('should throw an error if the expression is missing a "value" property', () => {
				delete expressions[0].right.right.value;
				expect(() => compiler.compile(expressions)).to.throw(Error);
			});
		});
	});
});