"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Audio } from 'react-loader-spinner'

const UploadComponent = ({ onClose, onSubmit,loading}) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setFile(fileURL); 
      setFileName(selectedFile.name); 
      setFileType(selectedFile.type); 
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-6 shadow-md rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-full"
        >
          Close
        </button>
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

            {loading==true ?(<div>
              <Audio
              height="80"
              width="80"
             radius="9"
            color="green"
              ariaLabel="loading"
            wrapperStyle
             wrapperClass
/>
<p style={{color:"black"}} className="pl-2"> your vedio is uploading ...</p>
            </div>
              
            ):( <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Upload
            </button>)}
           
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadComponent;
