"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch } from "~/lib/redux/store";
import Breadcrumb from "~/components/Breadcrumbs";
import ProjectSidebar from "~/components/ProjectSidebar";
import styles from "./ProjectLayout.module.scss";
import { Bell, LogOut } from "lucide-react";
import { logoutUser } from "~/lib/redux/features/authSlice";
import { fetchProjectByName } from "~/lib/redux/features/currentProjectSlice";

export default function ProjectLayout({ children }) {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { projectName } = params;

  useEffect(() => {
    if (projectName) {
      dispatch(fetchProjectByName(projectName));
    }
  }, [dispatch, projectName]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className={styles["layout"]}>
      <div className={styles["layout__sidebar"]}>
        <ProjectSidebar projectName={projectName} />
      </div>
      <main className={styles["layout__content"]}>
        <div className={styles["layout__content__header"]}>
          <Breadcrumb />

          <div className={styles["layout__content__header__right"]}>
            <div className={styles["layout__content__header__right__button"]}>
              <Bell size={20} />
            </div>
            <button
              onClick={handleLogout}
              className={styles["layout__content__header__right__button--red"]}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
