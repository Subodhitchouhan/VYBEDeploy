// socketClient.js
import { io } from "socket.io-client";
import { serverUrl } from "../App"; // or replace with direct string

let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io(serverUrl, {
      query: { userId },
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
