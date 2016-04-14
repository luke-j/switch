import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import './lib/Config';
import './lib/Generator';
import './lib/SpiderMonkey';
import './lib/Switch';
import './lib/compiler/ApacheCompiler';
import './lib/compiler/NginxCompiler';
import './lib/context/ApacheContext';
import './lib/context/NginxContext';
import './lib/syntax/ApacheSyntax';
import './lib/syntax/NginxSyntax';
import './lib/commands/Use';

global.sinon = sinon;
global.chai = chai;
global.expect = global.chai.expect;

global.chai.use(sinonChai);
