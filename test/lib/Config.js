import Config from '../../src/Config';

describe('Config', () => {
	let config;

	beforeEach(() => {
		config = new Config('test', 'test', {});
	});

	it('should expose the "type" variable', () => {
		expect(config.type).to.exist;
	});

	it('should expose the "options" variable', () => {
		expect(config.options).to.exist;
	});

	it('should expose the "locations" variable', () => {
		expect(config.locations).to.exist;
	});

	describe('when setting properties', () => {
		it('should set the "type" property on the instance', () => {
			config = new Config('test1', 'test2', {});
			expect(config.type).to.equal('test1');
		});

		it('should set the "name" property on the "options" property', () => {
			config = new Config('test1', 'test2', {});
			expect(config.options.name).to.equal('test2');
		});
	});

	describe('when merging objects', () => {
		it('should add properties present in the config object but absent in the defaults object', () => {
			config = new Config('test', 'test', {
				testPropertyOne: 123,
				testPropertyTwo: 456
			});

			expect(config.options.testPropertyOne).to.equal(123);
			expect(config.options.testPropertyTwo).to.equal(456);
		});

		it('should have config object properties should take precedence over the default properties', () => {
			config = new Config('test', 'test', {
				port: 1234
			});

			expect(config.options.port).to.equal(1234);
		});

		it('should keep default options not present in the config object', () => {
			config = new Config('test', 'test', {});

			expect(config.options.port).to.exist;
			expect(config.options.ssl).to.exist;
		});

		it('should add to the object', () => {
			config = new Config('test', 'test', {
				very: {
					deep: {
						object: {
							nesting: {}
						}
					}
				}
			});

			expect(config.options.very.deep.object.nesting).to.exist;
		});

		it('should merge objects recursively', () => {
			config = new Config('test', 'test', {
				ssl: {
					enable: true
				}
			});

			expect(config.options.ssl.enable).to.equal(true);
		});
	});

	describe('when parsing locations', () => {
		it('should match anything starting with a "/" as a location', () => {
			config = new Config('test', 'test', {'/one': {}, '/two': {}});

			expect(config.locations['/one']).to.exist;
			expect(config.locations['/two']).to.exist;
		});

		it('should not add locations if they aren\'t objects', () => {
			config = new Config('test', 'test', {'/one': {}, '/two': [], '/three': ''});

			expect(config.locations['/one']).to.exist;
			expect(config.locations['/two']).to.not.exist;
		});

		it('should add an "options" property to each location', () => {
			config = new Config('test', 'test', {'/one': {}, '/two': {}});

			expect(config.locations['/one'].options).to.exist;
			expect(config.locations['/two'].options).to.exist;
		});

		it('should remove the location from the main "options" object', () => {
			config = new Config('test', 'test', {'/one': {}});

			expect(config.options['/one']).to.not.exist;
		});
	});
});