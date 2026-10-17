import { useEffect, useState } from "react";
import React from 'react'
import axios from "axios"
import Modal from "../components/Modal/Modal";


function Planner() {
  const createSemester = (id) => ({ id, course: [] });

  const [years, setYears] = useState([{ id: 1, semesters: [createSemester(1)] },])
  const [user, setUsers] = useState([]);


  useEffect(() => {
    axios.get("http://localhost:3000/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  const addSemester = (yearId) => {
    setYears((currentYears) =>
      currentYears.map((year) =>
        year.id === yearId && year.semesters.length < 3
          ? {
            ...year,
            semesters: [
              ...year.semesters,
              createSemester(
                Math.max(0, ...year.semesters.map((semester) => semester.id)) + 1
              ),
            ],
          }
          : year
      )
    );
  };

  const addYear = () => {
    setYears((currentYears) => {
      const nextYearId = currentYears.length
        ? currentYears[currentYears.length - 1].id + 1
        : 1;

      return [
        ...currentYears,
        {
          id: nextYearId,
          semesters: [createSemester(1), createSemester(2)],
        },
      ];
    });
  }

  const removeSemester = (yearId, semesterId) => {
    const semesterIndex = years.findIndex((year) => year.id === yearId);
    const targetYear = years[semesterIndex];
    const targetSemester = targetYear?.semesters.find(
      (semester) => semester.id === semesterId
    );

    if (!targetSemester || targetYear.semesters[0]?.id === semesterId) {
      return;
    }

    const laterCourses = years
      .slice(semesterIndex)
      .flatMap((year) =>
        year.semesters
          .filter(
            (semester) =>
              year.id !== yearId ||
              targetYear.semesters.indexOf(semester) >
              targetYear.semesters.indexOf(targetSemester)
          )
          .flatMap((semester) => semester.course)
      );
    const dependentCourse = laterCourses.find((course) =>
      targetSemester.course.some(
        (removedCourse) =>
          course.course_prerequisite === removedCourse.course_code
      )
    );

    if (dependentCourse) {
      window.alert(
        `Remove ${dependentCourse.course_name} from a later semester before removing this semester.`
      );
      return;
    }

    setYears((currentYears) =>
      currentYears.map((year) => {
        if (
          year.id !== yearId ||
          year.semesters[0]?.id === semesterId
        ) {
          return year;
        }

        return {
          ...year,
          semesters: year.semesters.filter(
            (semester) => semester.id !== semesterId
          ),
        };
      })
    );
  };

  const updateSemesterCourses = (yearId, semesterId, courses) => {
    setYears((currentYears) =>
      currentYears.map((year) =>
        year.id === yearId
          ? {
            ...year,
            semesters: year.semesters.map((semester) =>
              semester.id === semesterId
                ? { ...semester, course: courses }
                : semester
            ),
          }
          : year
      )
    );
  };

  const orderedSemesters = years.flatMap((year) =>
    year.semesters.map((semester) => ({ yearId: year.id, semester }))
  );

  return (
    <>
      <h2>Planner</h2>
      <button className="btn add w-1/4" onClick={addYear}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-6 w-6 shrink-0"
          aria-hidden="true"
        >
          <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
        </svg>
        <span>Year</span>
      </button>
      <div className="planner">
        {years.map((year) => (
          <div className="planner-y" key={year.id}>
            <div className="planner-y-con">
              <h2>Year {year.id}</h2>
              <button
                type="button"
                className="btn add"
                onClick={() => addSemester(year.id)}
                disabled={year.semesters.length >= 3}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-6 w-6 shrink-0 ${year.semesters.length >= 3 ? 'hidden' : ''}`}
                  aria-hidden="true"
                >
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                <span>
                  {year.semesters.length >= 3 ? "Max 3 Semesters" : "Semester"}
                </span>
              </button>
            </div>
            <div className="planner-s">
              {year.semesters.map((semester, index) => {
                const semesterPosition = orderedSemesters.findIndex(
                  (entry) =>
                    entry.yearId === year.id &&
                    entry.semester.id === semester.id
                );
                const earlierCourses = orderedSemesters
                  .slice(0, semesterPosition)
                  .flatMap((entry) => entry.semester.course);
                const laterCourses = orderedSemesters
                  .slice(semesterPosition + 1)
                  .flatMap((entry) => entry.semester.course);
                const otherSemesterCourses = orderedSemesters
                  .filter((_, position) => position !== semesterPosition)
                  .flatMap((entry) => entry.semester.course);

                return (
                  <div
                    className="planner-sl"
                    id={`year-${year.id}-semester-${semester.id}`}
                    key={semester.id}
                  >
                    <div className="planner-sl-header">
                      <h3>Semester {index + 1}</h3>
                      {index > 0 && (
                        <button
                          type="button"
                          className="btn remove"
                          aria-label={`Remove Semester ${index + 1} from Year ${year.id}`}
                          onClick={() => removeSemester(year.id, semester.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <Modal
                      courseList={semester.course}
                      onCourseListChange={(courses) =>
                        updateSemesterCourses(year.id, semester.id, courses)
                      }
                      otherSemesterCourses={otherSemesterCourses}
                      prerequisiteCourses={earlierCourses}
                      futureSemesterCourses={laterCourses}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Planner