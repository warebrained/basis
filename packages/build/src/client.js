import util from 'gulp-util';
import webpack from 'webpack';

import constants from './constants';

export default (context) => {

  if (!context.hasClient) {

    return [];
  }
  
  const bundleClient = {

    /* Bundle client code & assets with Webpack */
    key: constants.taskKeys.bundleClient,
    func: (cb) => {

      webpack(context.webpackConfig, (err, stats) => {

        if (err) {
          throw new util.PluginError(constants.taskKeys.bundleClient, err);
        }

        if (context.config.options.logFileNames) {

          const ouptut = stats.toString({
            assets: true,
            chunks: false,
            chunkModules: false,
            colors: true,
            hash: false,
            timings: false,
            version: false
          });

          util.log(`[${constants.taskKeys.bundleClient}] Completed\n ${ouptut}`);
        }

        cb();
      });
    }
  };

  if (context.lint) {
    
    bundleClient.dependencies = [constants.taskKeys.lintClient];
  }

  return [bundleClient];
};