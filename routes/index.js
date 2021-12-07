const path = require('path');
const userRoutes = require('./users');
const hotelRoutes = require('./hotels');
const managementRoutes = require('./management');

const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use('/management', managementRoutes);
  app.use('/hotels', hotelRoutes);
  app.use('/home', (req, res) => res.render('partials/landing'))

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Path not found' });
  });
  };
  
  module.exports = constructorMethod;