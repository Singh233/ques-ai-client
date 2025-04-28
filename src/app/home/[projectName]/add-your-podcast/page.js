"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "~/lib/redux/store";
import { Rss, File, Youtube, FileAudio2 } from "lucide-react";
import styles from "./page.module.scss";
import UploadModal from "~/components/Modals/UploadModal";

export default function AddYourPodcastPage() {
  const router = useRouter();
  const params = useParams();
  const { projectName } = params;
  const { loading, error } = useAppSelector((state) => state.currentProject);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [modalHeading, setModalHeading] = useState("Upload File");
  const [modalIcon, setModalIcon] = useState(<File size={20} />);

  const podcastOptions = [
    {
      title: "RSS Feed",
      description: "Lorem ipsum dolor sit. Dolor lorem sit.",
      icon: <Rss size={24} />,
      action: () =>
        handleOpenUploadModal("Upload from RSS Feed", <Rss size={20} />),
    },
    {
      title: "YouTube Video",
      description: "Lorem ipsum dolor sit. Dolor lorem sit.",
      icon: <Youtube size={24} />,
      action: () =>
        handleOpenUploadModal("Upload from YouTube", <Youtube size={20} />),
    },
    {
      title: "Upload Files",
      description: "Lorem ipsum dolor sit. Dolor lorem sit.",
      icon: <File size={24} />,
      action: () =>
        handleOpenUploadModal("Upload from File", <File size={20} />),
    },
  ];

  const handleOpenUploadModal = (modalHeading, modalIcon) => {
    setModalIcon(modalIcon);
    setModalHeading(modalHeading);
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleUploadSubmit = (data) => {
    console.log("File uploaded:", data);
    // Handle the upload logic
  };

  if (loading) return <div>Loading project data...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles["podcast"]}>
      <div className={styles["podcast__title"]}>
        <h1>Add Your Podcast</h1>
      </div>

      <div className={styles["podcast__grid"]}>
        {podcastOptions.map((option, index) => (
          <div
            key={index}
            className={styles["podcast__grid__card"]}
            onClick={option.action}
            role="button"
            tabIndex={0}
          >
            <div className={styles["podcast__grid__card__group"]}>
              <h3 className={styles["podcast__grid__card__title"]}>
                {option.title}
              </h3>
              <p className={styles["podcast__grid__card__description"]}>
                {option.description}
              </p>
            </div>

            <div className={styles["podcast__grid__card__icon"]}>
              {option.icon}
            </div>
          </div>
        ))}
      </div>
      <div className={styles["podcast__card"]} role="button" tabIndex={0}>
        <div className={styles["podcast__card__group__icon"]}>
          <File size={24} />
        </div>
        <div className={styles["podcast__card__group"]}>
          <h3 className={styles["podcast__card__group__title"]}>
            Select a file or drag and drop here (Podcast Media or Transcription
            Text)
          </h3>
          <p className={styles["podcast__card__group__description"]}>
            MP4, MOV, MP3, WAV, PDF, DOCX or TXT file
          </p>
        </div>

        <button
          className={styles["podcast__card__button"]}
          onClick={() =>
            handleOpenUploadModal("Upload from File", <File size={20} />)
          }
        >
          Select File
        </button>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        icon={modalIcon}
        heading={modalHeading}
        contentLabel="Transcript"
        onSubmit={handleUploadSubmit}
      />
    </div>
  );
}
