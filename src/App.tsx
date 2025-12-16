import VideoPlayer from './components/VideoPlayer';
import Options from './components/Options';
import Notifications from './components/Notifications';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Video Chat App
        </h2>

        <VideoPlayer />
        <Options />
        <Notifications />
      </div>
    </div>
  );
};

export default App;
