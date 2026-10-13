import React from 'react'
import './App.css'
import { Flex, Text, Button } from '@radix-ui/themes'
import Modal from './components/Modal'

function App() {

  return (
    <>
      <Flex direction="column" gap="4">
        <h2>Planner</h2>
        <button>Add Semester</button>
        <Flex direction="column" className="course-card" gap="4">
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
        </Flex>
      </Flex>
    </>
  );
};

export default App
