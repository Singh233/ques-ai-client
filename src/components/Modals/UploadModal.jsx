import { useRef } from "react";
import styles from "./UploadModal.module.scss";

const UploadModal = ({
  isOpen,
  onClose,
  icon,
  heading = "Upload File",
  nameLabel = "Name",
  contentLabel = "Content",
  submitLabel = "Upload",
  onSubmit,
  isSubmitting = false,
}) => {
  const nameRef = useRef("");
  const contentRef = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && !isSubmitting) {
      onSubmit({
        name: nameRef.current.value,
        content: contentRef.current.value,
      });
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && !isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles["modal"]}>
      <div
        className={styles["modal__overlay"]}
        onClick={handleOverlayClick}
        onKeyDown={handleKeyDown}
      >
        <div className={styles["modal__overlay__content"]}>
          <div className={styles["modal__overlay__content__header"]}>
            <h2 className={styles["modal__overlay__content__title"]}>
              {icon && (
                <span
                  className={styles["modal__overlay__content__title__icon"]}
                >
                  {icon}
                </span>
              )}
              {heading}
            </h2>
            <button
              className={styles["modal__overlay__content__close"]}
              onClick={onClose}
              aria-label="Close"
              disabled={isSubmitting}
            >
              ✕
            </button>
          </div>

          <form
            className={styles["modal__overlay__content__form"]}
            onSubmit={handleSubmit}
          >
            <div className={styles["modal__overlay__content__form__group"]}>
              <label
                htmlFor="name"
                className={
                  styles["modal__overlay__content__form__group__label"]
                }
              >
                {nameLabel}
              </label>
              <input
                type="text"
                id="name"
                ref={nameRef}
                className={
                  styles["modal__overlay__content__form__group__input"]
                }
                disabled={isSubmitting}
              />
            </div>

            <div className={styles["modal__overlay__content__form__group"]}>
              <label
                htmlFor="content"
                className={
                  styles["modal__overlay__content__form__group__label"]
                }
              >
                {contentLabel}
              </label>
              <textarea
                id="content"
                ref={contentRef}
                className={
                  styles["modal__overlay__content__form__group__textarea"]
                }
                rows={6}
                disabled={isSubmitting}
              />
            </div>

            <div
              className={styles["modal__overlay__content__form__button-group"]}
            >
              <button
                type="submit"
                className={
                  styles[
                    "modal__overlay__content__form__button-group__upload-button"
                  ]
                }
                disabled={isSubmitting}
              >
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
