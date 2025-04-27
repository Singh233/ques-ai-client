import { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { createProject } from "~/lib/redux/features/projectsSlice";
import styles from "./CreateProjectModal.module.scss";
import { useAppSelector } from "~/lib/redux/store";
import { selectUser } from "~/lib/redux/features/authSlice";
import { toast } from "sonner";

const CreateProjectModal = ({ isOpen, onClose }) => {
  const user = useAppSelector(selectUser);
  const [projectName, setProjectName] = useState("");
  const dispatch = useDispatch();

  const createProjectMutation = useMutation({
    mutationFn: (projectData) => {
      return dispatch(createProject(projectData)).unwrap();
    },
    onSuccess: () => {
      toast.success("Project created successfully");
      setProjectName("");
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    createProjectMutation.mutate({
      user: user.id,
      name: projectName,
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles["modal"]}>
      <div className={styles["modal__overlay"]}>
        <div className={styles["modal__content"]}>
          <h2 className={styles["modal__title"]}>Create Project</h2>
          <form className={styles["modal__form"]} onSubmit={handleSubmit}>
            <div className={styles["modal__form__group"]}>
              <label
                htmlFor="projectName"
                className={styles["modal__form__group__label"]}
              >
                Enter Project Name:
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Type here"
                className={styles["modal__form__group__input"]}
              />
            </div>
            <div className={styles["modal__form__button-group"]}>
              <button
                type="button"
                className={styles["modal__form__button-group__cancel-button"]}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles["modal__form__button-group__create-button"]}
                disabled={createProjectMutation.isPending}
              >
                {createProjectMutation.isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
