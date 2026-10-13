import './App.css'
import Modal from './components/Modal/Modal'

function App() {

  return (
    <>
      <div className='inline-block item-center'>
        <h2>Planner</h2>
        <button>Add Semester</button>
        <div className="course-card">
          <div className="course-list" id="1">
            <Modal />
          </div>
          <div className="course-list" id="2">
            <Modal />
          </div>
          <div className="course-list" id="3">
            <Modal />
          </div>
          <div className="course-list" id="3">
            <Modal />
          </div>
        </div>
      </div>
    </>
  );
};

export default App
