'use strict';

const EventEmitter = require('events');

let event = new EventEmitter();
event.setMaxListeners(50);

exports.event = event;