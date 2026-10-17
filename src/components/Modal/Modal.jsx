import { useState } from "react";
import course from "../../mock/course.json";
import "./Modal.css";

export default function Modal({
    courseList,
    onCourseListChange,
    otherSemesterCourses,
    prerequisiteCourses,
    futureSemesterCourses,
}) {
    const [modal, setModal] = useState(false);
    const [selectedId, setSelectedId] = useState("");

    const toggleModal = () => {
        setModal(!modal);
    };

    const selectedCourse = course.find(
        (item) => String(item.course_id) === selectedId
    );

    const alertCreditTotal = (courses) => {
        const totalCredits = courses.reduce(
            (total, item) => total + item.course_credit,
            0
        );

        if (totalCredits < 6) {
            window.alert(`Total credits: ${totalCredits}. The minimum is 6 credits.`);
        } else if (totalCredits > 22) {
            window.alert(`Total credits: ${totalCredits}. The maximum is 22 credits.`);
        }
    };

    const addCourse = () => {
        if (!selectedCourse) {
            return;
        }

        if (courseList.some((item) => item.course_id === selectedCourse.course_id)) {
            window.alert(`${selectedCourse.course_name} is already in this semester.`);
            return;
        }

        if (
            selectedCourse.course_prerequisite &&
            !prerequisiteCourses.some(
                (item) => item.course_code === selectedCourse.course_prerequisite
            )
        ) {
            const prerequisiteCourse = course.find(
                (item) => item.course_code === selectedCourse.course_prerequisite
            );
            window.alert(
                `Add ${prerequisiteCourse?.course_name ?? selectedCourse.course_prerequisite} in an earlier semester first.`
            );
            return;
        }

        if (
            otherSemesterCourses.some(
                (item) => item.course_id === selectedCourse.course_id
            )
        ) {
            window.alert(
                `${selectedCourse.course_name} is already planned in another semester. Add it here again only if this is a retake.`
            );
        }

        const nextCourses = [...courseList, selectedCourse];
        onCourseListChange(nextCourses);
        alertCreditTotal(nextCourses);
        setSelectedId("");
        setModal(false);
    };

    const removeCourse = (courseIndex) => {
        const courseToRemove = courseList[courseIndex];
        const dependentCourse = [...courseList, ...futureSemesterCourses].find(
            (item) => item.course_prerequisite === courseToRemove.course_code
        );

        if (dependentCourse) {
            window.alert(
                `Remove ${dependentCourse.course_name} from this or a later semester before removing ${courseToRemove.course_name}.`
            );
            return;
        }

        const nextCourses = courseList.filter((_, index) => index !== courseIndex);
        onCourseListChange(nextCourses);
        alertCreditTotal(nextCourses);
    };

    return (
        <>
            <div className="course-list-items">
                {courseList.map((item, index) => (
                    <span className="course-list-item" key={`${item.course_id}-${index}`}>
                        <span className="course-list-item-details">
                            {item.course_code}
                        </span>
                        <button
                            type="button"
                            className="remove-course"
                            aria-label={`Remove ${item.course_name}`}
                            onClick={() => removeCourse(index)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="red" className="size-5">
                                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </span>
                ))}
            </div>

            <button type="button" onClick={toggleModal} className="btn-modal">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green" className="size-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" clipRule="evenodd" />
                </svg>
                ADD SUBJECT
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
                            {course.map((item) => (
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
                            className="rounded-full align-middle p-2 m-2 bg-green-600 text-white"
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