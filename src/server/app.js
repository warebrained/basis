import express from 'express';

import AppBuilder from './middleware/appBuilder';

export default (container) => {

  const appBuilder = AppBuilder.create(container, express());

  return appBuilder.useEjs()
                   .logRequests()
                   .useDataParsers()
                   .secure()
                   .defaultContent()
                   .useRoutes()
                   .handleErrors()
                   .trustProxy()
                   .result;
};