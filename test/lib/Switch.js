import Switch from '../../lib/Switch';

describe('Switch', () => {
	it('should expose the "main" method', () => {
		expect(Switch.main).to.be.a.function;
	});

	it('should exit the process if an invalid command is given', () => {
		expect(() => Switch.main(['--command', 'invalid-command'])).to.throw();
	});

	it('should allow for the "to" command', () => {
		expect(() => Switch.main(['--command', 'to', '--to', 'nginx', '--config', '/'])).to.not.throw();
	});
});