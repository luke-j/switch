import To from '../../../src/commands/To';

describe('To Command', () => {
	let to;

	beforeEach(() => {
		to = new To('nginx', '{"test.com":{}}', '/dir/name');
	});

	it('should expose the "generate" method', () => {
		expect(to.generate).to.be.a.function;
	});

	describe('generate()', () => {
		it('should return a string', () => {
			expect(to.generate()).to.be.a.string;
		});

		it('should exit the process if an invalid "use" parameter is given', () => {
			to = new To('invalid-use-param', '{"test.com":{}}', '../../../');
			expect(() => to.generate()).to.throw();
		});

		it('should allow for the "nginx" use parameter', () => {
			to = new To('nginx', '{"test.com":{}}', '/dir/name');
			expect(() => to.generate()).to.not.throw();
		});

		it('should allow for the "apache" use parameter', () => {
			to = new To('apache', '{"test.com": {"port": 1234}}', '/dir/name');
			expect(() => to.generate()).to.not.throw();
		});

		describe('when generating with an invalid "template" path', () => {
			it('should still return a string', () => {
				expect(to.generate()).to.be.a.string;
			});
		});
	});
});