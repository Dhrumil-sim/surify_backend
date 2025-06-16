import { Server, Socket } from 'socket.io';
import { CollaborativeSessionService } from '@collabSessionModule';

export function setupCollaborativeSessionSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join-session', async ({ sessionId, userId }) => {
      socket.join(sessionId);
      await CollaborativeSessionService.addParticipant(sessionId, userId);
      io.to(sessionId).emit('user-joined', { userId });
    });

    socket.on('add-to-queue', async ({ sessionId, songId }) => {
      await CollaborativeSessionService.addToQueue(sessionId, songId);
      io.to(sessionId).emit('queue-updated', { songId });
    });

    socket.on('play-song', ({ sessionId, songId }) => {
      io.to(sessionId).emit('play-song', { songId });
    });

    socket.on('pause-song', ({ sessionId }) => {
      io.to(sessionId).emit('pause-song');
    });

    socket.on('leave-session', ({ sessionId, userId }) => {
      socket.leave(sessionId);
      io.to(sessionId).emit('user-left', { userId });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
