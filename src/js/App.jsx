import "../css/App.css"

import ErrorBoundary from "./shared/ErrorBoundary"
import Video from "./components/video/Video"
// import TimeTracker from "./components/time_tracker/TimeTracker"

const App = (props) => {
  return (
    <ErrorBoundary>
      <Video {...props} />
    </ErrorBoundary>
  )
}

export default App;
