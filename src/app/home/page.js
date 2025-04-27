"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchCurrentUser, logoutUser } from "~/lib/redux/features/authSlice";
import { fetchProjects } from "~/lib/redux/features/projectsSlice";
import styles from "./page.module.scss";
import {
  Bell,
  CirclePlus,
  CirclePlusIcon,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";
import CreateProjectModal from "~/components/Projects/CreateProjectModal";

export default function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    isAuthenticated,
    user,
    loading: authLoading,
  } = useSelector((state) => state.auth);
  const { projects, loading: projectsLoading } = useSelector(
    (state) => state.projects
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Authenticated");
      dispatch(fetchProjects());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    // If not authenticated and not loading, redirect to login page
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      router.push("/");
    });
  };

  const openCreateProjectModal = () => {
    setIsModalOpen(true);
  };

  const closeCreateProjectModal = () => {
    setIsModalOpen(false);
  };

  if (authLoading) {
    return (
      <div className={styles["loading-container"]}>
        <div className={styles["loading-container__spinner"]}></div>
      </div>
    );
  }

  return (
    <div className={styles["home"]}>
      <div className={styles["home__header"]}>
        <div className={styles["home__header__logo"]}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="16" fill="white" />
            <path
              d="M22 11L10 21"
              stroke="#6C2BE7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M10 11L22 21"
              stroke="#6C2BE7"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className={styles["home__header__logo__text"]}>Ques.AI</span>
        </div>
        <div className={styles["home__header__actions"]}>
          <div className={styles["home__header__actions__user"]}>
            {user?.name || "User"}
          </div>
          <div className={styles["home__header__actions__settings"]}>
            <Settings size={20} />
          </div>
          <div className={styles["home__header__actions__notifications"]}>
            <Bell size={20} />
          </div>
          <div className={styles["home__header__actions__logout"]}>
            <button onClick={handleLogout}>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles["home__content"]}>
        {projects.length === 0 ? (
          // No projects view
          <>
            <div className={styles["home__content__title"]}>
              <h1>Create a New Project</h1>
            </div>

            <div className={styles["home__content__image"]}>
              <div
                className={styles["home__content__image__placeholder"]}
              ></div>
            </div>

            <div className={styles["home__content__description"]}>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in
              </p>
            </div>

            <div className={styles["home__content__actions"]}>
              <button
                className={styles["home__content__actions__button"]}
                onClick={openCreateProjectModal}
              >
                <CirclePlus size={24} fill="white" color="#211935" /> Create New
                Project
              </button>
            </div>
          </>
        ) : (
          // Projects list view
          <>
            <div className={styles["projects__header"]}>
              <h1>Projects</h1>
              <button
                className={styles["projects__create-btn"]}
                onClick={openCreateProjectModal}
              >
                <CirclePlusIcon size={24} fill="white" color="#211935" />
                Create New Project
              </button>
            </div>

            <div className={styles["projects__list"]}>
              {projectsLoading ? (
                <div className={styles["projects__loading"]}>
                  Loading projects...
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project._id} className={styles["project-card"]}>
                    <div className={styles["project-card__icon"]}>
                      {project.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className={styles["project-card__details"]}>
                      <h3>{project.name}</h3>
                      <div className={styles["project-card__meta"]}>
                        {project.metaData?.fileCount || 0} Files
                        {project.metaData?.lastEdited && (
                          <span>
                            Last edited{" "}
                            {new Date(
                              project.metaData.lastEdited
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={closeCreateProjectModal}
      />
    </div>
  );
}
