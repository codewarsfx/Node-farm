"use strict";

var express = require('express');

var viewController = require('../controllers/viewController');

var Router = express.Router();
Router.get('/', viewController.getOverview);
Router.get('/tour/:slug', viewController.getTour);
Router.get('/login', viewController.login);
module.exports = Router;