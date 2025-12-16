import { useContext } from 'react';
import { SocketContext } from '../Context';

const Notifications: React.FC = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);

  if (!call.isReceivingCall || callAccepted) return null;

  return (
    <div className="flex items-center justify-between gap-4 mb-5 rounded-xl border border-slate-700 bg-slate-900 px-6 py-4">
      <h3 className="text-lg font-medium text-white">
        {call.name || 'Someone'} is calling 📞
      </h3>

      <button
        onClick={answerCall}
        className="rounded-lg border border-green-500 px-4 py-2 text-green-400 transition hover:bg-green-500 hover:text-black"
      >
        Answer Call
      </button>
    </div>
  );
};

export default Notifications;