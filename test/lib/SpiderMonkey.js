import SpiderMonkey from '../../lib/SpiderMonkey';

describe('SpiderMonkey globals', () => {
	it('should expose the "print" method', () => {
		expect(SpiderMonkey.print).to.be.a.function;
	});

	it('should expose the "quit" method', () => {
		expect(SpiderMonkey.quit).to.be.a.function;
	});

	it('should expose the "read" method', () => {
		expect(SpiderMonkey.read).to.be.a.function;
	});

	it('should expose the "environment" method', () => {
		expect(SpiderMonkey.environment).to.be.a.function;
		expect(SpiderMonkey.environment().length).to.equal(0);
	});

	it('should expose the "scriptArgs" method', () => {
		expect(SpiderMonkey.scriptArgs).to.be.a.function;
		expect(SpiderMonkey.scriptArgs().length).to.equal(0);
	});
});