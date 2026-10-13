import React, { useState } from "react";
import "./Modal.css";
import course from "../mock/course.json";

export default function Modal() {
    const [modal, setModal] = useState(false);
    const [selectedId, setSelectedId] = useState("");

    const toggleModal = () => {
        setModal(!modal);
    };

    // Find the selected course
    const selectedCourse = course.find(
        (item) => String(item.course_id) === selectedId
    );

    // Generate options from JSON
    const courseElement = [];

    for (let i = 0; i < course.length; i++) {
        courseElement.push(
            <option
                key={course[i].course_id}
                value={course[i].course_id}
            >
                {course[i].course_code} {course[i].course_name}
            </option>
        );
    }

    return (
        <>
            <button onClick={toggleModal} className="btn-modal">
                + Add Course
            </button>

            {modal && (
                <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>

                    <div className="modal-content">
                        <h2>Add Subject</h2>

                        <select
                            value={selectedId}
                            onChange={(e) => setSelectedId(e.target.value)}
                        >
                            <option value="">-- Select Course --</option>
                            {courseElement}
                        </select>

                        {/* Display selected course information */}
                        {selectedCourse && (
                            <div className="course-detail">
                                <h3>Course Information</h3>
                                <p>
                                    <strong>Course Code:</strong>{" "}
                                    {selectedCourse.course_code}
                                </p>

                                <p>
                                    <strong>Course Name:</strong>{" "}
                                    {selectedCourse.course_name}
                                </p>
                                <p>
                                    <strong>Course ID:</strong>{" "}
                                    {selectedCourse.course_id}
                                </p>
                            </div>
                        )}

                        <button
                            className="close-modal"
                            onClick={toggleModal}
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}