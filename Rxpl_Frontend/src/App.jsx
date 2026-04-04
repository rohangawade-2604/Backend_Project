
// import { LiveUser } from '../../Rxpl_Backend/src/Schema_models/UserLiveModel';
import './App.css'
import PrescriptionLive from './prescription/prescription';
// import { LiveUser } from "./LiveUsers/liveUsers"
import LiveUser from "./LiveUsers/liveUsers"

function App() {

  return (
    <>
      <h1>Rxpl Frontend</h1>
    {/* <PrescriptionLive/> */}
    <LiveUser/>

    </>
  )
}

export default App
