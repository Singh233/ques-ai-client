import React from "react";
import moment from "moment";
import "moment/locale/en-gb";
import styles from "./ProjectCard.module.scss";
import Link from "next/link";

const ProjectCard = ({ project }) => {
  const lastEditedDate = React.useMemo(() => {
    return project.metaData?.lastEdited
      ? new Date(project.metaData.lastEdited)
      : new Date(project.createdAt);
  }, [project.metaData?.lastEdited, project.createdAt]);

  return (
    <Link
      href={`/home/${project.name.toLowerCase().split(" ").join("-")}/add-your-podcast`}
      className={styles["card"]}
    >
      <div className={styles["card__icon"]}>
        {project.name.substring(0, 2).toUpperCase()}
      </div>
      <div className={styles["card__details"]}>
        <h3>{project.name}</h3>
        <div className={styles["card__meta"]}>
          <p>{project.metaData?.fileCount || 0} Files</p>
          <p>
            {lastEditedDate && (
              <span>Last edited {moment(lastEditedDate).calendar()}</span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};

const ProjectCardSkeleton = () => {
  return (
    <div className={styles["skeleton"]}>
      <div className={styles["skeleton__icon"]}></div>
      <div className={styles["skeleton__details"]}>
        <div className={styles["skeleton__title"]}></div>
        <div className={styles["skeleton__meta"]}></div>
      </div>
    </div>
  );
};

export { ProjectCardSkeleton };

export default ProjectCard;
