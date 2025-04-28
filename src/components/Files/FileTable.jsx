import Link from "next/link";
import styles from "./FileTable.module.scss";
import { generatePath } from "~/lib/utils";

/**
 * FileTable component for displaying a list of files with actions
 * @param {Object} props
 * @param {Array} props.files - Array of file objects
 * @param {Function} props.onView - Function to call when View button is clicked
 * @param {Function} props.onDelete - Function to call when Delete button is clicked
 * @returns {JSX.Element}
 */
export default function FileTable({ files, project, onView, onDelete }) {
  // Format date to display like "25 Oct 23 | 09:04"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year} | ${hours}:${minutes}`;
  };

  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className={styles["table"]}>
      <div className={styles["table__header"]}>
        <div className={styles["table__header__cell__no"]}>No.</div>
        <div className={styles["table__header__cell__name"]}>Name</div>
        <div className={styles["table__header__cell__date"]}>
          Upload Date & Time
        </div>
        <div className={styles["table__header__cell__action"]}>Action</div>
      </div>

      {files.map((file, index) => (
        <div key={file.id} className={styles["table__row"]}>
          <div className={styles["table__row__cell__no"]}>{index + 1}</div>
          <div className={styles["table__row__cell__name"]}>{file.name}</div>
          <div className={styles["table__row__cell__date"]}>
            {formatDate(file.createdAt)}
          </div>
          <div className={styles["table__row__cell__action"]}>
            <Link
              href={`/home/${generatePath(project.name)}/edit-transcript?fileId=${file.id}`}
              className={styles["table__row__cell__action__btn__view"]}
              onClick={() => onView(file.id)}
              aria-label={`View ${file.name}`}
            >
              View
            </Link>
            <button
              className={styles["table__row__cell__action__btn__delete"]}
              onClick={() => onDelete(file.id, file.name)}
              aria-label={`Delete ${file.name}`}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
