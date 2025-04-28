"use client";

import { useAppSelector } from "~/lib/redux/store";
import styles from "./page.module.scss";
import Link from "next/link";
import { generatePath } from "~/lib/utils";
import { PlusCircle } from "lucide-react";
import moment from "moment";
import { useMemo } from "react";

export default function DashboardPage() {
  const { loading, error, project } = useAppSelector(
    (state) => state.currentProject
  );
  const lastEditedDate = useMemo(() => {
    return project?.metaData?.lastEdited
      ? new Date(project.metaData.lastEdited)
      : new Date(project?.createdAt);
  }, [project]);

  return (
    <div className={styles["container"]}>
      <div className={styles["container__title"]}>
        <h1>Dashboard</h1>
      </div>

      <div className={styles["container__content"]}>
        <div className={styles["container__content__card"]}>
          <h2>Project Name</h2>
          <p>{project?.name}</p>
        </div>

        <div className={styles["container__content__card"]}>
          <h2>Project Files</h2>
          <p>{project?.metaData?.fileCount}</p>
        </div>

        <div className={styles["container__content__card"]}>
          <h2>Last edited</h2>
          <p>{moment(lastEditedDate).calendar()}</p>
        </div>
      </div>

      <div className={styles["container__actions"]}>
        <p className={styles["container__actions__heading"]}>Quick links</p>

        <Link
          href={`/home/${generatePath(project?.name || "")}/add-your-podcast`}
          className={styles["container__actions__item"]}
        >
          <PlusCircle fill="white" color="#4f46e5" size={40} />
          <h3>Add your Podcast</h3>
        </Link>
      </div>
    </div>
  );
}
