"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "~/lib/redux/features/authSlice";
import { fetchProjects } from "~/lib/redux/features/projectsSlice";
import styles from "./page.module.scss";
import {
  Bell,
  CirclePlus,
  CirclePlusIcon,
  LogOut,
  Settings,
} from "lucide-react";
import CreateProjectModal from "~/components/Projects/CreateProjectModal";
import ProjectCard, {
  ProjectCardSkeleton,
} from "~/components/Projects/ProjectCard";
import Logo from "~/components/Logo/Logo";
import Link from "next/link";
import { toast } from "sonner";

export default function HomePage() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { projects, loading: projectsLoading } = useSelector(
    (state) => state.projects
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProjects());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const openCreateProjectModal = () => {
    setIsModalOpen(true);
  };

  const closeCreateProjectModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles["home"]}>
      <div className={styles["home__header"]}>
        <div className={styles["home__header__logo"]}>
          <Logo size="md" variant="text-purple" />
        </div>
        <div className={styles["home__header__actions"]}>
          <div
            onClick={() => {
              toast.info("Coming soon!");
            }}
            className={styles["home__header__actions__item"]}
          >
            <Bell size={20} />
          </div>
          <button
            onClick={handleLogout}
            className={styles["home__header__actions__item"]}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className={styles["home__content"]}>
        {projects.length === 0 && !projectsLoading ? (
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
                <>
                  {[...Array(3)].map((_, index) => (
                    <ProjectCardSkeleton key={`skeleton-${index}`} />
                  ))}
                </>
              ) : (
                projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
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
