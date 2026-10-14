import { useState } from 'react'
import './App.css'
import Addcourse from './components/Modal/Addcourse'
import Sidebar from './components/sidebar/Sidebar'

const SEMESTERS_PER_PAGE = 4
const createSemester = (id) => ({ id, courses: [] })

function App() {
  const [years, setYears] = useState([
    { id: 1, semesters: [createSemester(1)] },
  ])
  const [currentPage, setCurrentPage] = useState(0)

  const allSemesters = years.flatMap((year) =>
    year.semesters.map((semester) => ({ year, semester }))
  )
  const pageCount = Math.ceil(allSemesters.length / SEMESTERS_PER_PAGE)
  const visiblePage = Math.min(currentPage, pageCount - 1)
  const visibleSemesters = allSemesters.slice(
    visiblePage * SEMESTERS_PER_PAGE,
    (visiblePage + 1) * SEMESTERS_PER_PAGE
  )

  const addSemester = (yearId) => {
    const year = years.find((item) => item.id === yearId)
    if (!year || year.semesters.length >= 3) {
      return
    }

    const newSemesterIndex =
      years
        .slice(0, years.findIndex((item) => item.id === yearId))
        .reduce((total, item) => total + item.semesters.length, 0) +
      year.semesters.length

    setYears((currentYears) =>
      currentYears.map((year) =>
        year.id === yearId && year.semesters.length < 3
          ? {
            ...year,
            semesters: [
              ...year.semesters,
              createSemester(year.semesters.length + 1),
            ],
          }
          : year
      )
    )
    setCurrentPage(Math.floor(newSemesterIndex / SEMESTERS_PER_PAGE))
  }

  const addYear = () => {
    const newSemesterIndex = allSemesters.length
    setYears((currentYears) => [
      ...currentYears,
      {
        id: Math.max(...currentYears.map((year) => year.id)) + 1,
        semesters: [createSemester(1)],
      },
    ])
    setCurrentPage(Math.floor(newSemesterIndex / SEMESTERS_PER_PAGE))
  }

  const removeSemester = (yearId, semesterId) => {
    const yearIndex = years.findIndex((year) => year.id === yearId)
    const targetYear = years[yearIndex]
    const semesterIndex = targetYear.semesters.findIndex(
      (semester) => semester.id === semesterId
    )

    if (yearId === 1 && semesterIndex === 0) {
      return
    }

    const semesterToRemove = targetYear.semesters[semesterIndex]
    const courseCodes = semesterToRemove.courses.map((item) => item.course_code)
    const futureCourses = years
      .slice(yearIndex)
      .flatMap((year, index) =>
        index === 0
          ? year.semesters.slice(semesterIndex + 1)
          : year.semesters
      )
      .flatMap((semester) => semester.courses)
    const dependentCourse = futureCourses.find((item) =>
      courseCodes.includes(item.course_prerequisite)
    )

    if (dependentCourse) {
      window.alert(
        `Cannot remove this semester because ${dependentCourse.course_name} depends on a course in it.`
      )
      return
    }

    setYears((currentYears) =>
      currentYears.map((year) =>
        year.id === yearId
          ? {
            ...year,
            semesters: year.semesters
              .filter((semester) => semester.id !== semesterId)
              .map((semester, index) => ({ ...semester, id: index + 1 })),
          }
          : year
      )
    )
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        <h2 id="planner">Planner</h2>
        <div className='planner' id="semester-plan">
        <div className="planner-controls">
          {years.filter((year) => year.semesters.length < 3).map((year) => (
            <button
              type="button"
              className="add-semester"
              key={year.id}
              onClick={() => addSemester(year.id)}
            >
              + Add Semester to Year {year.id}
            </button>
          ))}
          <button type="button" className="add-year" onClick={addYear}>+ Add Year</button>
        </div>
        <div className="semester-card">
          {visibleSemesters.map(({ year, semester }) => {
            const semesterIndex = allSemesters.findIndex(
              (item) => item.year.id === year.id && item.semester.id === semester.id
            )
            const semestersBefore = allSemesters.slice(0, semesterIndex)
            const semestersAfter = allSemesters.slice(semesterIndex + 1)
            const otherSemesterCourses = semestersBefore
              .concat(semestersAfter)
              .flatMap((item) => item.semester.courses)

            return (
              <div className="course-list" key={`${year.id}-${semester.id}`}>
                <div className="semester-header">
                  <h4>Year {year.id} Semester {semester.id}</h4>
                  {!(year.id === 1 && semester.id === 1) && (
                    <button
                      type="button"
                      className="remove-semester"
                      onClick={() => removeSemester(year.id, semester.id)}
                    >
                      -
                    </button>
                  )}
                </div>
                <Addcourse
                  courseList={semester.courses}
                  onCourseListChange={(courses) => {
                    setYears((currentYears) =>
                      currentYears.map((currentYear) =>
                        currentYear.id === year.id
                          ? {
                            ...currentYear,
                            semesters: currentYear.semesters.map((currentSemester) =>
                              currentSemester.id === semester.id
                                ? { ...currentSemester, courses }
                                : currentSemester
                            ),
                          }
                          : currentYear
                      )
                    )
                  }}
                  otherSemesterCourses={otherSemesterCourses}
                  prerequisiteCourses={semestersBefore.flatMap((item) => item.semester.courses)}
                  futureSemesterCourses={semestersAfter.flatMap((item) => item.semester.courses)}
                />
              </div>
            )
          })}
        </div>
        {pageCount > 1 && (
          <nav className="page-navigation" aria-label="Semester pages">
            <button
              type="button"
              onClick={() => setCurrentPage(visiblePage - 1)}
              disabled={visiblePage === 0}
            >
              ‹ Previous
            </button>
            <span>Page {visiblePage + 1} of {pageCount}</span>
            <button
              type="button"
              onClick={() => setCurrentPage(visiblePage + 1)}
              disabled={visiblePage === pageCount - 1}
            >
              Next ›
            </button>
          </nav>
        )}
        </div>
      </main>
    </div>
  );
}

export default App
