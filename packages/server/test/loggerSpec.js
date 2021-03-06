import { expect } from 'chai';
import * as sinon from 'sinon';
import proxyquire from 'proxyquire';

import { the, should, when,
         createStubObject, assertParameter } from '../../testing/src';

the('logger', () => {

  const stubConfig = {};
  const stubWinston = createStubObject(['info', 'error', 'warn']);
  const stubGetWinston = sinon.stub().returns(stubWinston);

  let Logger;
  let logger;

  before(() => {

    proxyquire.noCallThru();

    const mocks = {

      './winstonProvider': stubGetWinston
    };

    Logger = proxyquire('../src/core/logger', mocks).default;
    logger = Logger.createFromConfig(stubConfig);
  });

  when('instantiated', () => {

    should('initialise winston instance from input config', () => {

      assertParameter(stubGetWinston, 0, stubConfig);
      expect(logger._winston).to.be.equal(stubWinston);
    });
  });

  when('logStream requested', () => {

    should('return a morgan compatible stream', () => {

      const result = logger.logStream;

      expect(result.write).to.not.be.undefined;
    });
  });

  when('logStream written to', () => {

    let winstonInfoSpy;
    let result;

    before(() => {

      winstonInfoSpy = sinon.spy(stubWinston, 'info');
      logger.logStream.write('Test message\n with second line');
      result = winstonInfoSpy.args[0][0];
    });

    after(() => {

      winstonInfoSpy.restore();
    });

    should('log a [REQUEST] info message to winston', () => {

      expect(result.includes('[REQUEST]')).to.be.equal(true);
    });

    should('strip out carridge returns', () => {

      expect(result.includes('\n')).to.be.equal(false);
    });
  });

  when('info called', () => {

    let winstonInfoSpy;
    let result;

    before(() => {

      winstonInfoSpy = sinon.spy(stubWinston, 'info');
      logger.info('Test info message');
      result = winstonInfoSpy.args[0][0];
    });

    after(() => {

      winstonInfoSpy.restore();
    });

    should('log info message to winston', () => {

      expect(result).to.be.equal('Test info message');
    });
  });

  when('error called', () => {

    let winstonErrorSpy;
    let result;

    before(() => {

      winstonErrorSpy = sinon.spy(stubWinston, 'error');
      logger.error('Test error message');
      result = winstonErrorSpy.args[0][0];
    });

    after(() => {

      winstonErrorSpy.restore();
    });

    should('log error message to winston', () => {

      expect(result).to.be.equal('Test error message');
    });
  });

  when('warn called', () => {

    let winstonWarnSpy;
    let result;

    before(() => {

      winstonWarnSpy = sinon.spy(stubWinston, 'warn');
      logger.warn('Test warn message');
      result = winstonWarnSpy.args[0][0];
    });

    after(() => {

      winstonWarnSpy.restore();
    });

    should('log warn message to winston', () => {

      expect(result).to.be.equal('Test warn message');
    });
  });
});