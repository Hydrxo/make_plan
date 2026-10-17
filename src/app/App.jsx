
import './App.css'
import Demo_grade from "./components/Parser/demo_grade";


export default function App() {
  return (
    <>
      <div className="app-shell"> {/* outermost */}
        <main className="app-main">
          <Demo_grade />
        </main>
      </div>
    </>
  )
}
