import ApacheContext from '../../../lib/context/ApacheContext';

describe('ApacheContext', () => {
	let context;

	beforeEach(() => {
		context = new ApacheContext('test1');
	});

	describe('when creating context', () => {
		it('should not allow invalid context types', () => {
			expect(() => new ApacheContext('test1', 'invalid-context-type')).to.throw(Error);
		});

		it('should set the type', () => {
			expect(context.type).to.equal('Location');
		});

		it('should expose the "Config" variable', () => {
			context.Config = 123;
			expect(context.Config).to.equal(123);
		});

		it('should expose the "Syntax" variable', () => {
			context.Syntax = 123;
			expect(context.Syntax).to.equal(123);
		});

		it('should expose the "Compiler" variable', () => {
			context.Compiler = 123;
			expect(context.Compiler).to.equal(123);
		});

		it('should expose the "lines" variable', () => {
			expect(context.lines).to.deep.equal([]);
		});

		it('should expose the "contexts" variable', () => {
			expect(context.contexts).to.deep.equal([]);
		});
	});

	describe('addContext()', () => {
		it('should push a new context instance into the "contexts" variable', () => {
			context.addContext('test1');

			expect(context.contexts[0]).to.be.instanceOf(ApacheContext);
		});

		it('should correctly set "type" and "directive" of the new context', () => {
			context.addContext('test1', 'Location');

			expect(context.contexts[0].type).to.equal('Location');
			expect(context.contexts[0].directive).to.equal('test1');
		});
	});
});
