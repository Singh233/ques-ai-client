"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "~/lib/redux/store";
import Breadcrumb from "~/components/Breadcrumbs";
import ProjectSidebar from "~/components/ProjectSidebar";
import styles from "./ProjectLayout.module.scss";
import { Bell, LogOut, Menu } from "lucide-react";
import { logoutUser, selectLoggingOut } from "~/lib/redux/features/authSlice";
import { fetchProjectByName } from "~/lib/redux/features/currentProjectSlice";
import { toast } from "sonner";

export default function ProjectLayout({ children }) {
  const isLoggingOut = useAppSelector(selectLoggingOut);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const params = useParams();
  const dispatch = useAppDispatch();
  const { projectName } = params;

  const toastId = "logout-toast";

  useEffect(() => {
    if (projectName) {
      dispatch(fetchProjectByName(projectName));
    }
  }, [dispatch, projectName]);

  useEffect(() => {
    console.log(isLoggingOut);
    if (isLoggingOut) {
      toast.loading("Logging out...", {
        id: toastId,
      });
    }
  }, [isLoggingOut]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      toast.success("Logged out successfully", {
        id: toastId,
        duration: 3000,
      });
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 950) {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className={styles["layout"]}>
      <div className={styles["layout__sidebar"]}>
        <ProjectSidebar
          projectName={projectName}
          isCollapsed={isCollapsed}
          onToggle={handleToggleSidebar}
        />
      </div>
      <main className={styles["layout__content"]}>
        <div className={styles["layout__content__header"]}>
          <Breadcrumb />

          <div className={styles["layout__content__header__right"]}>
            <button
              onClick={() => {
                toast.info("This feature is not available yet.");
              }}
              className={styles["layout__content__header__right__button"]}
            >
              <Bell size={20} />
            </button>
            <button
              onClick={handleLogout}
              className={styles["layout__content__header__right__button--red"]}
              disabled={isLoggingOut}
            >
              <LogOut size={20} />
            </button>

            <button
              onClick={() => {
                setIsCollapsed((prev) => !prev);
              }}
              className={styles["layout__content__header__right__button--menu"]}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
