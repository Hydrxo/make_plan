import { useState } from "react";
import "./Modal.css";
import course from "../../mock/course.json";

export default function Modal() {
    const [modal, setModal] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [addedCourses, setAddedCourses] = useState([]);

    const toggleModal = () => {
        setModal(!modal);
    };

    const availableCourses = course.filter(
        (item) => !item.course_prerequisite.trim()
    );

    // Find the selected course
    const selectedCourse = availableCourses.find(
        (item) => String(item.course_id) === selectedId
    );

    const addCourse = () => {
        if (!selectedCourse) {
            return;
        }

        setAddedCourses((currentCourses) => [...currentCourses, selectedCourse]);
        setSelectedId("");
        setModal(false);
    };

    return (
        <>
            <div className="course-list-items">
                {addedCourses.map((item, index) => (
                    <span className="course-list-item" key={`${item.course_id}-${index}`}>
                        {item.course_code} {item.course_name}
                        <button
                            type="button"
                            className="remove-course"
                            aria-label={`Remove ${item.course_name}`}
                            onClick={() =>
                                setAddedCourses((currentCourses) =>
                                    currentCourses.filter((_, courseIndex) => courseIndex !== index)
                                )
                            }
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>

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
                            {availableCourses.map((item) => (
                                <option key={item.course_id} value={item.course_id}>
                                    {item.course_code} {item.course_name}
                                </option>
                            ))}
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
                            id="submit"
                            className="rounded-full"
                            hidden={!selectedCourse}
                            onClick={addCourse}
                        >
                            submit
                        </button>

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