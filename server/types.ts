import express from 'express';
import WebSocket from 'ws';

export interface Request extends express.Request { 
  uid: string,
  lecture: any
}

export interface Socket extends WebSocket {
  uid: string,
  isAlive: boolean,
  send(msg: string): void,
  json(obj: object): void
}

export interface BasicAccountInfo {
  uid?: string,
  email: string,
  first_name: string,
  last_name: string,
  photo: string
}