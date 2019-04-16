import gulp from 'gulp';

import constants from './packages/build/src/tasks/constants';
import { cleanPackages } from './packages/build/src/tasks/clean';
import compilePackages from './packages/build/src/packages/compile';

const keys = constants.taskKeys;

gulp.task(keys.cleanPackages, (cb) => { cleanPackages(undefined, cb); });
gulp.task(keys.compilePackages, [keys.cleanPackages], () => compilePackages(undefined));