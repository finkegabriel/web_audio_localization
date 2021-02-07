import { VOLUME,FREQ } from "./lib/consts";
import {
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  XAxis,
  Legend,
} from "recharts";
import { ReactMic } from "react-mic";
import { useState } from "react";

function App() {
  const [record, setRecord] = useState(false);
  const [data, setData] = useState({FREQ:0});
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var oscillator = audioCtx.createOscillator();

  const handleStart = () => {
    oscillator.type = "sine";
    oscillator.frequency.value = FREQ; // value in hertz
    oscillator.volume = VOLUME;
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    console.log("START");
  };

  const handleStop = () => {
    oscillator.stop();
    console.log("STOP");
  };

  const startRecording = () => {
    setRecord(true);
  };

  const stopRecording = () => {
    setRecord(false);
  };

  const onData = (recordedBlob) => {
    console.log("chunk of real-time data is: ", recordedBlob);
    setData(recordedBlob.size);
  };

  const onStop = (recordedBlob) => {
    console.log("recordedBlob is: ", recordedBlob);
  };

  document.title = "Acoustic Location";
  return (
    <div className="App">
      <input onClick={handleStart} type="button" value="start" name="start" />
      <input onClick={handleStop} type="button" value="stop" name="stop" />
      <div id="waveform"></div>
      <ReactMic
        record={() => setRecord(!record)}
        className="sound-wave"
        onStop={onStop}
        onData={onData}
        strokeColor="#000000"
        backgroundColor="#FF4081"
      />
      <button onClick={startRecording} type="button">
        Start
      </button>
      <button onClick={stopRecording} type="button">
        Stop
      </button>
      <LineChart
        width={400}
        height={400}
        data={[
          { name: "POINT_1", FREQ: data.size },
        ]}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="Audio" />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Legend />
        <Line type="monotone" dataKey="FREQ" stroke="#ff7300" yAxisId={0} />
        {/* <Line type="monotone" dataKey="TIME" stroke="#387908" yAxisId={1} /> */}
      </LineChart>
    </div>
  );
}

export default App;
