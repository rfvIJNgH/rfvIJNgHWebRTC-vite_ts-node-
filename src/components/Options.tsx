import { useState, useContext, type ChangeEvent } from 'react';
import copy from 'copy-to-clipboard';
import {
  BiClipboard,
  BiPhoneCall,
  BiPhoneOff,
} from 'react-icons/bi';
import { SocketContext } from '../Context';

const Options: React.FC = () => {
  const {
    me,
    callAccepted,
    name,
    setName,
    callEnded,
    leaveCall,
    callUser,
  } = useContext(SocketContext);

  const [idToCall, setIdToCall] = useState('');

  return (
    <div className="mx-auto mt-9 max-w-6xl px-4">
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Info */}
          <div>
            <h6 className="mb-4 text-lg font-semibold text-white">
              Account Info
            </h6>

            <label className="mb-1 block text-sm text-slate-400">
              Username
            </label>
            <input
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
            />

            <button
              onClick={() => copy(me)}
              className="flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-slate-300 transition hover:bg-slate-800"
            >
              <BiClipboard size={18} />
              Copy ID
            </button>
          </div>

          {/* Make a Call */}
          <div>
            <h6 className="mb-4 text-lg font-semibold text-white">
              Make a Call
            </h6>

            <label className="mb-1 block text-sm text-slate-400">
              User ID to call
            </label>
            <input
              type="text"
              value={idToCall}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setIdToCall(e.target.value)
              }
              className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
            />

            {callAccepted && !callEnded ? (
              <button
                onClick={leaveCall}
                className="flex items-center gap-2 rounded-lg border border-red-500 px-4 py-2 text-red-400 transition hover:bg-red-500 hover:text-black"
              >
                <BiPhoneOff size={18} />
                Hang up
              </button>
            ) : (
              <button
                onClick={() => callUser(idToCall)}
                className="flex items-center gap-2 rounded-lg border border-green-500 px-4 py-2 text-green-400 transition hover:bg-green-500 hover:text-black"
              >
                <BiPhoneCall size={18} />
                Call
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;
