"use client";

import { useState } from "react";
import { useAppSelector } from "~/lib/redux/store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Rss, File, Youtube } from "lucide-react";
import axios from "axios";
import { env } from "~/env.mjs";
import { getCookie } from "~/lib/hooks/useCookies";
import { toast } from "sonner";
import styles from "./page.module.scss";
import UploadModal from "~/components/Modals/UploadModal";
import FileTable from "~/components/Files/FileTable";

export default function AddYourPodcastPage() {
  const { loading, error, project } = useAppSelector(
    (state) => state.currentProject
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [modalHeading, setModalHeading] = useState("Upload File");
  const [modalIcon, setModalIcon] = useState(<File size={20} />);

  // Fetch files using React Query
  const fetchFiles = async () => {
    if (!project?.id) return null;

    const API_URL = env.NEXT_PUBLIC_API_URL;
    const token = getCookie("accessToken");

    const response = await axios.get(`${API_URL}/file/project/${project.id}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const {
    data: filesData,
    isLoading: filesLoading,
    error: filesError,
    refetch: refetchFiles,
  } = useQuery({
    queryKey: ["files", project?.id],
    queryFn: fetchFiles,
    enabled: !!project?.id, // Only run the query when project ID is available
  });

  // File upload mutation
  const uploadFileMutation = useMutation({
    mutationFn: async (fileData) => {
      const API_URL = env.NEXT_PUBLIC_API_URL;
      const token = getCookie("accessToken");

      const response = await axios.post(
        `${API_URL}/file/create`,
        {
          project: project.id,
          name: fileData.name,
          transcript: fileData.content,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("File uploaded successfully");
      refetchFiles(); // Refresh the files list after successful upload
      handleCloseUploadModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to upload file");
    },
  });

  const handleViewFile = (fileId) => {
    // Implement view file functionality
    console.log("View file:", fileId);
  };

  const handleDeleteFile = (fileId) => {
    // Implement delete file functionality
    console.log("Delete file:", fileId);
  };

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
    if (!project?.id) {
      toast.error("Project not found");
      return;
    }

    uploadFileMutation.mutate(data);
  };

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

      {loading || filesLoading ? (
        <div className={styles["podcast__loading"]}></div>
      ) : filesData?.results?.length <= 0 ? (
        <div className={styles["podcast__card"]} role="button" tabIndex={0}>
          <div className={styles["podcast__card__group__icon"]}>
            <File size={24} />
          </div>
          <div className={styles["podcast__card__group"]}>
            <h3 className={styles["podcast__card__group__title"]}>
              Select a file or drag and drop here (Podcast Media or
              Transcription Text)
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
      ) : (
        ""
      )}

      {/* Files Section - Display files associated with this project */}
      {!loading && !filesLoading && filesData?.results?.length > 0 ? (
        <div className={styles["podcast__files"]}>
          <h2>Your Files</h2>
          <FileTable
            files={filesData.results}
            onView={handleViewFile}
            onDelete={handleDeleteFile}
          />
        </div>
      ) : (
        ""
      )}

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        icon={modalIcon}
        heading={modalHeading}
        contentLabel="Transcript"
        onSubmit={handleUploadSubmit}
        submitLabel={uploadFileMutation.isPending ? "Uploading..." : "Upload"}
        isSubmitting={uploadFileMutation.isPending}
      />
    </div>
  );
}
