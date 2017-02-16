import { expect } from 'chai';
import * as sinon from 'sinon';
import { the, when, should, and } from './../testing/specAliases';

import { getRequestLogger, __RewireAPI__ as loggingAPI } from './../middleware/logging';

the('logging middleware initialiser', () => {

   let stubMorgan;
   const stubMorganResult = { dummyMorgan: true };
   const stubLogStream = {};

   before(() => {

      stubMorgan = sinon.stub();
      stubMorgan.returns(stubMorganResult);
      loggingAPI.__Rewire__('morgan', stubMorgan);
   });

   after(() => {

      loggingAPI.__ResetDependency__('morgan');
   });

   const assertResult = (result, expectedResult) => {

      expect(result).to.not.be.undefined;
      expect(result).to.equal(expectedResult);
   };

   const assertFormat = (expectedFormat) => {

      expect(stubMorgan.args[0][0]).to.be.equal(expectedFormat);
   }

   const assertStream = () => {

      expect(stubMorgan.args[0][1].stream).to.be.equal(stubLogStream);
   }

   const invoke = (config) => {

      stubMorgan.reset();
      return getRequestLogger(config, stubLogStream);
   }

   when('non-production env config', () => {

      const stubConfig = { env: 'development' };
      let result;

      before(() => {
         result = invoke(stubConfig);
      });

      should('return a valid morgan instance', () => {

         assertResult(result, stubMorganResult);
      });

      should('use morgan \'dev\' format', () => {

         assertFormat('dev');
      });

      should('should set the output stream', () => {

         assertStream();
      });
   });

   when('production env config', () => {

      const stubConfig = { env: 'production' };
      let result;

      before(() => {
         result = invoke(stubConfig);
      });

      should('return a valid morgan instance', () => {

         assertResult(result, stubMorganResult);
      });

      should('use morgan \'combined\' format', () => {

         assertFormat('combined');
      });

      should('set the output stream', () => {

         assertStream();
      });
   });
});