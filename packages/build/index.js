import 'colors';
import fs from 'fs';
import gulp from 'gulp';
import path from 'path';

import assetTasks from './src/assets';
import buildTasks from './src/build';
import cleanTasks from './src/clean';
import clientTasks from './src/client';
import createTasks from './src/create';
import lintTasks from './src/lint';
import packagesTasks from './src/packages';
import serverTasks from './src/server';
import publishTasks from './src/publish';
import constants from './src/constants';
import getEnvSettings from './src/settings';

export { logFileWrite, sassOptions } from './src/utilities';

export const initialiseTasks = (config, packageJson, webpackConfig) => {

  // TODO: Add validate config step here (and throw error if anything missing)

  const runtimeDir = process.cwd();
  const context = {
    config,
    runtimeDir,
    envSettings: getEnvSettings(path.join(runtimeDir, 'config')),
    packageJson,
    webpackConfig,
    hasPackages: fs.existsSync(path.join(runtimeDir, 'packages')),
    lint: config.options.lint !== undefined ? config.options.lint : true
  };

  const taskSources = [assetTasks, buildTasks, cleanTasks, clientTasks, createTasks, lintTasks, packagesTasks, serverTasks, publishTasks];
  const allTasks = taskSources.map(ts => ts(context))
                              .reduce((acc, cur) => acc.concat(cur), []);

  allTasks.forEach((t) => {

    switch (true) {

      case t.dependencies === undefined: {

        gulp.task(t.key, t.func);
        break;
      }

      case t.func === undefined: {

        gulp.task(t.key, t.dependencies);
        break;
      }

      default: {

        gulp.task(t.key, t.dependencies, t.func);
        break;
      }
    }
  });

  return constants.taskKeys;
};