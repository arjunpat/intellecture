import express from 'express';
import WebSocket from 'ws';

export interface Request extends express.Request { 
  uid: string,
  lecture: Lecture
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

export interface Lecture {
  uid: string,
  created_at: number,
  class_uid: string,
  lecture_name: string,
  start_time?: number,
  end_time?: number,
  join_code?: string,
  account_uid: string,
  class_name: string,
  class_section: string,
  creator?: BasicAccountInfo
}