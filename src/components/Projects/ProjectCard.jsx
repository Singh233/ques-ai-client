import React from "react";
import styles from "./ProjectCard.module.scss";

const ProjectCard = ({ project }) => {
  return (
    <div className={styles["card"]}>
      <div className={styles["card__icon"]}>
        {project.name.substring(0, 2).toUpperCase()}
      </div>
      <div className={styles["card__details"]}>
        <h3>{project.name}</h3>
        <div className={styles["card__meta"]}>
          {project.metaData?.fileCount || 0} Files
          {project.metaData?.lastEdited && (
            <span>
              Last edited{" "}
              {new Date(project.metaData.lastEdited).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
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
