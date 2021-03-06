import { expect } from 'chai';
import * as sinon from 'sinon';
import proxyquire from 'proxyquire';

import { the, when, should, withScenario } from '../../testing/src';

the('Config class', () => {

  when('created (from settings file)', () => {

    let Config;
    const stubGetEnvVariable = sinon.stub();
    const stubJsonfile = { readFileSync: () => {} };
    const settingsFilePath = 'SomeFilePath';
    const stubSettingsJson = {
      default: {
        someDefaultSetting: 'someDefaultValue'
      },
      someEnv: {
        bla: 'BlaBlaValue'
      }
    };

    before(() => {

      proxyquire.noCallThru();
      sinon.stub(stubJsonfile, 'readFileSync').returns(stubSettingsJson);

      const mocks = {

        './utilities': { getEnvVariable: stubGetEnvVariable, getRootPath: sinon.stub().returns('') },
        jsonfile: stubJsonfile
      };

      Config = proxyquire('../src/core/config', mocks).default;
    });

    withScenario('no specified NODE_ENV', () => {

      let result;

      before(() => {

        stubGetEnvVariable.returns('default');

        result = Config.createFromSettingsFile(settingsFilePath);
      });

      after(() => {

        stubGetEnvVariable.reset();
      });

      should('include default settings', () => {

        expect(result.someDefaultSetting).to.equal('someDefaultValue');
      });

      should('include env name', () => {

        expect(result.shared.env).to.equal('default');
      });
    });

    withScenario('a known (configured) NODE_ENV', () => {

      let result;

      before(() => {

        stubGetEnvVariable.returns('someEnv');

        result = Config.createFromSettingsFile(settingsFilePath);
      });

      after(() => {

        stubGetEnvVariable.reset();
      });

      should('include default settings', () => {

        expect(result.someDefaultSetting).to.equal('someDefaultValue');
      });

      should('include the specific env settings', () => {

        expect(result.bla).to.equal(stubSettingsJson.someEnv.bla);
      });

      should('include env name', () => {

        expect(result.shared.env).to.equal('someEnv');
      });
    });

    withScenario('an unknown (non-configured) NODE_ENV', () => {

      let result;

      before(() => {

        stubGetEnvVariable.returns('someUnkownEnv');

        try {

          Config.createFromSettingsFile(settingsFilePath);
        } catch (e) {

          result = e.message;
        }
      });

      after(() => {

        stubGetEnvVariable.reset();
      });

      should('throw error indicating unknown environment', () => {

        expect(result).to.equal('Unable to bootstrap for environment: \'someUnkownEnv\'. No settings found in settings file for this environment.');
      });
    });
  });
});