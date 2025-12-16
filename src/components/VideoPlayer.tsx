import { useContext } from 'react';
import { SocketContext } from '../Context';

const VideoPlayer: React.FC = () => {
  const {
    name,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,
    call,
  } = useContext(SocketContext);

  return (
    <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* My video */}
      {stream && (
        <div className="flex flex-col items-center">
          <h5 className="mb-2 text-lg font-medium text-white">
            {name || 'Name'}
          </h5>
          <video
            ref={myVideo}
            playsInline
            muted
            autoPlay
            className="w-full max-w-xl rounded-2xl border border-slate-700 bg-black"
          />
        </div>
      )}

      {/* User's video */}
      {callAccepted && !callEnded && (
        <div className="flex flex-col items-center">
          <h5 className="mb-2 text-lg font-medium text-white">
            {call.name || 'Name'}
          </h5>
          <video
            ref={userVideo}
            playsInline
            autoPlay
            className="w-full max-w-xl rounded-2xl border border-green-500 bg-black"
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
