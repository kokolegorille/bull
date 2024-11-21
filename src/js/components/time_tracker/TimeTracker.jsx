import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"

import ProcessCard from "./ProcessCard"

const TimeTracker = () => {
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

export default TimeTracker;
