import { Canvas } from "@react-three/fiber"
import Experience from "./Components/Experience"
import Drawer from "./Components/Drawer"
import { Leva } from "leva"
import { Perf } from "r3f-perf"


function App() {


  return (
    <>

<Drawer/>

<Leva hidden/>

     <Canvas >



      <Experience />
     </Canvas>
    </>
  )
}

export default App
