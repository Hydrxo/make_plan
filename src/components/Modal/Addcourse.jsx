import { useState } from "react";
import "./Addcourse.css";
import course from "../../mock/course.json";

export default function Addcourse({
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
    const totalCredits = courseList.reduce(
        (total, item) => total + item.course_credit,
        0
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
                        {item.course_code} {item.course_name}
                        <button
                            type="button"
                            className="remove-course"
                            aria-label={`Remove ${item.course_name}`}
                            onClick={() => removeCourse(index)}
                        >
                            −
                        </button>
                    </span>
                ))}
            </div>

            <p className="total-credit">Total Credit: {totalCredits}</p>

            <button type="button" onClick={toggleModal} className="btn-modal">
                <span aria-hidden="true">+</span> ADD SUBJECT
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