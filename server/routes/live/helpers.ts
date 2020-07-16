import WebSocket from 'ws';
import { Socket } from '../../types';

export function jsonifySocket(socket: Socket) {
  /* socket.on('message', data => {
    try {
      socket.onjson(JSON.parse(data));
    } catch (e) { console.log(e); }
  }); */

  socket.json = (obj: object) => socket.send(JSON.stringify(obj));
}

export function handleUpgrade(wss: WebSocket.Server, req: any): Promise<Socket> {
  return new Promise((resolve, reject) => {
    wss.handleUpgrade(req, req.socket, req.ws.head, (s: Socket) => {
      jsonifySocket(s);
      resolve(s);
    });
  });
}

export function toController(lecture_uid: string): string {
  return lecture_uid + ':ctl';
}

export function toStudent(lecture_uid: string): string {
  return lecture_uid + ':s';
}

export function toTeacher(lecture_uid: string): string {
  return lecture_uid + ':t'
}

export function toLectureUid(channel: string): string {
  return channel.split(':')[0];
}

export function genUnderstandingScore(arr: number[]): number {
  let sum = 0;
  for (let each of arr) sum += each;
  return Math.round((sum / arr.length) * 10);
}
