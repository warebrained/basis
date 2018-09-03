import Rx from 'rxjs/Rx';

import constants from '../constants';
import publish from './publish';
import link from './link';
import { logMessage, getPackages } from './utilities';
import compilePackagesFunc from './compile';

const runCmdForPackages = (packages, cmdOp, cb) => {

  Rx.Observable
    .from(packages.map(cmdOp))
    .mergeAll()
    .toArray()
    .subscribe((results) => {

      results.forEach((r) => { logMessage(r.message, r.success); });
      cb();
    }, (err) => {

      cb(err);
    });
};

export default ({ hasPackages, config, lint }) => {

  if (!hasPackages) {

    return [];
  }

  const packages = getPackages();
  const compilePackages = {

    /* Compile nested basis packages */
    key: constants.taskKeys.compilePackages,
    func: () => compilePackagesFunc(config)
  };

  if (lint) {

    compilePackages.dependencies = [constants.taskKeys.lintPackages];
  }

  return [
    compilePackages, {

      /* Publish compiled packages to npm registry */
      key: constants.taskKeys.publishPackages,
      func: (cb) => {

        runCmdForPackages(packages, p => publish(p), cb);
      }
    }, {

      /* Link sub packages */
      key: constants.taskKeys.linkPackages,
      func: (cb) => {

        runCmdForPackages(packages, p => link(config, p), cb);
      }
    }, {

      /* Unlink sub packages */
      key: constants.taskKeys.unlinkPackages,
      func: (cb) => {

        runCmdForPackages(packages, p => link(config, p, false), cb);
      }
    }
  ];
};