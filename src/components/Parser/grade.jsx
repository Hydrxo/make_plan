import { useState } from "react";
// import * as pdfjsLib from "pdf-dist/build/pdf.js";
// import pdfWorkerUrl from "pdf-dist/build/pdf.worker.min.js?url";
import gradePdfUrl from "./PDF/Grade.pdf?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const cleanText = (text) => text.replaceAll("\0", "").replace(/\s+/g, " ").trim();

async function parseGradePdf(pdfData) {
  const document = await pdfjsLib.getDocument({
    data: new Uint8Array(pdfData),
  }).promise;

  try {
    const pages = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const textContent = await page.getTextContent();
      pages.push(
        textContent.items
          .filter((item) => typeof item.str === "string" && item.transform)
          .map((item) => ({
            text: item.str,
            left: item.transform[4],
            top: item.transform[5],
          }))
      );
    }

    const courses = pages.flatMap((texts) => {
      const years = texts
        .map((item) => {
          const match = cleanText(item.text).match(/\d+\/(\d{4})$/);
          return match ? { year: Number(match[1]), top: item.top } : null;
        })
        .filter(Boolean);

      return texts.flatMap((item) => {
        const courseCode = cleanText(item.text);
        if (!/^\d{9}$/.test(courseCode)) {
          return [];
        }

        const rowItems = texts.filter(
          (rowItem) => Math.abs(rowItem.top - item.top) < 2
        );
        const courseName = rowItems
          .filter((rowItem) => rowItem.left >= 180 && rowItem.left < 580)
          .sort((a, b) => a.left - b.left)
          .map((rowItem) => cleanText(rowItem.text))
          .filter(Boolean)
          .join(" ");
        const creditText = rowItems
          .find((rowItem) => rowItem.left >= 630 && rowItem.left < 710)
          ?.text;
        const gradeText = rowItems
          .find((rowItem) => rowItem.left >= 710)
          ?.text;
        const year = years
          .filter((yearEntry) => yearEntry.top >= item.top)
          .sort((a, b) => a.top - b.top)[0]?.year;
        const courseCredit = Number(cleanText(creditText ?? ""));

        if (!courseName || !Number.isFinite(courseCredit) || !year) {
          throw new Error(`Could not read all fields for course ${courseCode}.`);
        }

        return [{
          course_code: courseCode,
          course_name: courseName,
          course_credit: courseCredit,
          course_grade: cleanText(gradeText ?? "") || null,
          year_enroll: year,
        }];
      });
    });

    if (!courses.length) {
      throw new Error("No course records were found in the PDF.");
    }

    return courses;
  } finally {
    await document.destroy();
  }
}

export default function Grade() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const extractGrades = async () => {
    setIsExtracting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(gradePdfUrl);
      if (!response.ok) {
        throw new Error(`Unable to load Grade.pdf (${response.status}).`);
      }

      const courses = await parseGradePdf(await response.arrayBuffer());
      const json = JSON.stringify(courses, null, 2);
      const downloadUrl = URL.createObjectURL(
        new Blob([json], { type: "application/json" })
      );
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "grades.json";
      link.click();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setMessage(`Extracted ${courses.length} courses to grades.json.`);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "An unexpected error occurred while reading the PDF."
      );
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <section aria-labelledby="grade-import-title" className="my-4 px-2">
      <h3 id="grade-import-title">Import grades from PDF</h3>
      <div className="my-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn rounded-lg border px-4 py-2"
          onClick={extractGrades}
          disabled={isExtracting}
        >
          {isExtracting ? "Reading PDF..." : "Extract and download JSON"}
        </button>
        {message && <p role="status">{message}</p>}
        {error && <p role="alert">{error}</p>}
      </div>
    </section>
  );
}