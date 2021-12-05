const path = require('path');
const userRoutes = require('./users');

const constructorMethod = (app) => {
    // app.use('/', (req, res) => {
    //     res.sendFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('/')), '/static/landing.html'));
    // });
    // app.use('/hotels', (req, res) => {
    //     res.sendFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('/')), '/static/hotels.html'));
    // });
    // app.use('/profile', (req, res) => {
    //   // maybe id in url?
    //   res.sendFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('/')), '/static/profile.html'));
  // });
  app.use('/', userRoutes);
  
  app.use('/manage', (req, res) => {
    res.sendFile(path.join(__dirname.substring(0, __dirname.lastIndexOf('/')), '/static/management.html'));
});
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Path not found' });
    });
  };
  
  module.exports = constructorMethod;