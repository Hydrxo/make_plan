import React from 'react'
import './App.css'
import { Flex, Text, Button } from '@radix-ui/themes'
import Modal from './components/Modal'

function App() {
  const addCourse = () => {
    console.log("add course")
  }
  return (
    <>
      <Modal />
      <Flex direction="column" gap="4">
        <h2>Planner</h2>
        <button onClickCapture={console.log("add semester")}>Add Semester</button>
        <Flex direction="column" className="course-card" gap="4">
          <div className="course-list" id="1">
            <button onClick={addCourse()}>add course</button>
          </div>
          <div className="course-list" id="2">

          </div>
          <div className="course-list" id="3">

          </div>
          <div className="course-list" id="3">

          </div>
        </Flex>
      </Flex>
    </>
  );
};

export default App
