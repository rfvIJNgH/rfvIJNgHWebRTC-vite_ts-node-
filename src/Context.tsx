import {
    createContext,
    useState,
    useRef,
    useEffect
} from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import type { Instance as PeerInstance, SignalData } from 'simple-peer';

/* ================= TYPES ================= */

interface Call {
    isReceivingCall?: boolean;
    from?: string;
    name?: string;
    signal?: SignalData;
}

interface SocketContextType {
    call: Call;
    callAccepted: boolean;
    callEnded: boolean;
    stream: MediaStream | null;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    me: string;
    myVideo: React.RefObject<HTMLVideoElement | null>;
    userVideo: React.RefObject<HTMLVideoElement | null>;
    callUser: (id: string) => void;
    answerCall: () => void;
    leaveCall: () => void;
}

interface Props {
    children: ReactNode;
}

/* ================= SOCKET ================= */

const socket: Socket = io('http://localhost:8081');

/* ================= CONTEXT ================= */

export const SocketContext = createContext<SocketContextType>(
    {} as SocketContextType
);

/* ================= PROVIDER ================= */

export const ContextProvider = ({ children }: Props) => {
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [name, setName] = useState('');
    const [call, setCall] = useState<Call>({});
    const [me, setMe] = useState('');

    const myVideo = useRef<HTMLVideoElement | null>(null);
    const userVideo = useRef<HTMLVideoElement | null>(null);
    const connectionRef = useRef<PeerInstance | null>(null);

    /* ================= MEDIA ================= */

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
            });

        socket.on('me', (id: string) => setMe(id));

        socket.on(
            'callUser',
            ({ from, name: callerName, signal }: Call) => {
                setCall({
                    isReceivingCall: true,
                    from,
                    name: callerName,
                    signal,
                });
            }
        );

        return () => {
            socket.off('me');
            socket.off('callUser');
        };
    }, []);

    /* ================= ACTIONS ================= */

    const answerCall = () => {
        if (!stream || !call.signal) return;

        setCallAccepted(true);

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on('signal', (data: SignalData) => {
            socket.emit('answerCall', {
                signal: data,
                to: call.from,
            });
        });

        peer.on('stream', (currentStream: MediaStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });

        peer.signal(call.signal);
        connectionRef.current = peer;
    };

    const callUser = (id: string) => {
        if (!stream) return;

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on('signal', (data: SignalData) => {
            socket.emit('callUser', {
                userToCall: id,
                signalData: data,
                from: me,
                name,
            });
        });

        peer.on('stream', (currentStream: MediaStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });

        socket.on('callAccepted', (signal: SignalData) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current?.destroy();
        window.location.reload();
    };

    /* ================= PROVIDER ================= */

    return (
        <SocketContext.Provider
            value={{
                call,
                callAccepted,
                callEnded,
                stream,
                name,
                setName,
                me,
                myVideo,
                userVideo,
                callUser,
                leaveCall,
                answerCall,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
