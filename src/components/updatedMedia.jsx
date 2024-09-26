"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { Audio } from 'react-loader-spinner';
import axios from "axios";
import apis from "../app/apis/apis";
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";

const UpdateMedia = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setFile(fileURL);
      setFileName(selectedFile.name);
      setFileType(selectedFile.type);
    }
  };

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get(`${apis.getEditUserMedia}/${id}`);
        setValue("fileName", response?.data?.media?.title);
        setValue("file", response?.data?.media?.file);
        setFile(response?.data?.media?.file);
        setFileName(response?.data?.media?.title);
        setFileType(response?.data?.media?.mediaType);
      } catch (error) {
        console.error("Error fetching media:", error);
        toast.error("Error fetching media data.");
      }
    };

    fetchMedia();
  }, [id]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', data.file[0]);
      formData.append('mediaType', data.file[0].type);
      formData.append('title', data.fileName);

      const response = await axios.put(`${apis.updateMedia}/${id}`, formData,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message);
      router.push("/usermedia");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex mt-8 items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 shadow-md rounded-lg relative">
        <h2 className="text-zinc-900 text-xl font-semibold text-center mb-4">Upload File</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fileName">
              File Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="fileName"
              type="text"
              placeholder="File Name"
              {...register('fileName', { required: true })}
            />
            {errors.fileName && <span className="text-red-500 text-sm">File Name is required</span>}
          </div>
          <div className="mb-6">
            <input
              type="file"
              accept="audio/*,video/*"
              className="mb-4 border-2 rounded-lg p-2 cursor-pointer"
              {...register('file', { onChange: handleFileChange, required: true })}
            />
            {errors.file && <span className="text-red-500 text-sm">File is required</span>}
            {file && (
              <div className="w-full p-4">
                <h2 className="text-lg text-gray-700 font-semibold mb-2">{fileName}</h2>
                {fileType.startsWith('audio/') ? (
                  <audio controls className="w-full">
                    <source src={file} />
                    Your browser does not support the audio tag.
                  </audio>
                ) : (
                  <video controls className="w-full">
                    <source src={file} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}

            {loading ? (
              <div>
                <Audio
                  height="80"
                  width="80"
                  radius="9"
                  color="green"
                  ariaLabel="loading"
                  wrapperStyle
                  wrapperClass
                />
                <p style={{ color: "black" }} className="pl-2">Your video is uploading</p>
              </div>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Upload
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMedia;
