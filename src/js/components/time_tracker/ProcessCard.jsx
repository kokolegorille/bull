import React from "react"

const ProcessCard = ({title, process}) => {
    return (
        <div className="process-card">
            <h3>{title}</h3>
            <span>{process.name} (ID: {process.id}) </span>
            <span>Running Time: {process.running_time_formatted} </span>
            <span>Memory: {process.memory_in_bytes} bytes</span>
        </div>
    )
}

export default ProcessCard