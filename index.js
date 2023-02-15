// cns-interface.js - CNS Interface Transport
// Copyright 2023 Padi, Inc. All Rights Reserved.

'use strict';

// Imports

const cns = require('cns-sdk');
const ws = require('ws');

// Classes

const Application = cns.Application;
const Connection = cns.Connection;
const Transport = cns.Transport;

// Interface transport

class Interface extends Transport {

  // Properties

  uri = 'ws://localhost:8080';
  protocol = 'cns-protocol';
  client;

  // Constructor

  // Create new transport
  constructor(options) {
    super(options);
  }

  // Methods

  // Open trsnsport
  open(options) {
    // Close previous
    this.close();

    // Copy options
    options = options || {};

    if (options.uri) this.uri = options.uri;
    if (options.protocol) this.protocol = options.protocol;

    // Create socket client
    this.client = new ws.WebSocket(this.uri, this.protocol)
    // Socket open
    .on('open', () => {
      super.open();
    })
    // Socket message
    .on('message', (packet) => {
      this.receive(packet);
    })
    // Socket close
    .on('close', () => {
      super.close();
    })
    // Socket error
    .on('error', (error) => {
      super.error(error);
    });

    return this;
  }

  // Send packet
  send(packet) {
    const action = this.stringify(packet);
    if (action) this.client.send(action);

    return this;
  }

  // Receive packet
  receive(packet) {
    const action = this.parse(packet);
    if (action) super.message(action);
  }

  // Close transport
  close() {
    if (this.client) {
      this.client.close();
      this.client = undefined;
    }
    return this;
  }
}

// Exports

exports.Transport = Interface;
