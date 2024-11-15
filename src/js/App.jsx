import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import "../css/App.css"

import ProcessCard from "./components/ProcessCard"

function App() {
  const [processes, setProcesses] = useState([])
  const [maxMemoryProcess, setMaxMemoryProcess] = useState(null)
  const [maxRunningProcess, setMaxRunningProcess] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const processList = await invoke("list_process")
      const maxMemory = await invoke("max_memory")
      const maxRunning = await invoke("max_running_process")

      setProcesses(processList)
      setMaxMemoryProcess(maxMemory)
      setMaxRunningProcess(maxRunning)
    }
    fetchData()

    const interval = setInterval(fetchData, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="container">
      {maxMemoryProcess && <ProcessCard title="Max Memory Process" process={maxMemoryProcess}/>}
      {maxRunningProcess && <ProcessCard title="Max Running Process" process={maxRunningProcess}/>}

      <div className="process-list">
        {processes.map(process => (
          <div key={process.id} className="process-item">
            <span>{process.name} (ID: {process.id}) </span>
            <span>Running Time: {process.running_time_formatted} </span>
            <span>Memory: {process.memory_in_bytes} bytes</span>
          </div>
        ))}
      </div>

    </main>
  );
}

export default App;

// import { useState } from "react";
// import { invoke } from "@tauri-apps/api/core";
// import "../css/App.css";

// function App() {
//   const [greetMsg, setGreetMsg] = useState("");
//   const [name, setName] = useState("");

//   async function greet() {
//     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//     setGreetMsg(await invoke("greet", { name }));
//   }

//   return (
//     <main className="container">
//       <h1>Bull w/ Tauri + React</h1>

//       <form
//         className="row"
//         onSubmit={(e) => {
//           e.preventDefault();
//           greet();
//         }}
//       >
//         <input
//           id="greet-input"
//           onChange={(e) => setName(e.currentTarget.value)}
//           placeholder="Enter a name..."
//         />
//         <button type="submit">Greet</button>
//       </form>
//       <p>{greetMsg}</p>
//     </main>
//   );
// }

// export default App;

