"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UploadComponent from "../../components/UploadComponent";
import axios from "axios";
import apis from "../apis/apis";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

import { Audio } from 'react-loader-spinner'
import Link from "next/link";

export default function Home() {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [users,setUser]=useState([]);

  


  const token = Cookies.get("token");

  const showModal = () => {
    if (!token) {
      toast.error("Please log in first to upload media");
    } else {
      setModal(true);
    }
  };

  const closeModal = () => {
    setModal(false);    
  };
  const fetchMedia = async () => {
    try {
      const id = localStorage.getItem("userId");
        const response = await axios.get(apis.getUserMedia,{ 
          params: { userId: id } 
      }); 
        console.log("Response:", response.data); 
        setUser(response?.data) 
    } catch (error) {
        console.error("Error fetching media:", error);
    }
};

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', data.file[0]);
      formData.append('mediaType', data.file[0].type);
      formData.append('title', data.fileName);

      const response = await axios.post(apis.uploadFile, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    
      toast.success(response.data.message);
      setModal(false);
      
      await fetchMedia(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Error uploading file");
    } finally {
      setLoading(false);
    }
  };





  
    const deleteMedia = async (id) => {
      if(token){
      if (!window.confirm("Are you sure you want to delete this media?")) return;
  
      setLoading(true);
      try {
        const response = await axios.delete(`${apis.deleteFile}/${id}`);
        toast.success(response.data.message);
        await fetchMedia(); // Refresh users list after deletion
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error deleting media");
      } finally {
        setLoading(false);
      }
    }else{
      toast.error("you are not able to deletle Please Login First")
    }
    };

  

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div className="flex justify-center mt-4">
       
        <div className="relative mr-3 md:mr-0 hidden md:block" style={{ width: "50%" }}>
          <input
            type="text"
            id="search"
            style={{ width: "100%" }}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
            placeholder="Search..."
          />
        </div>
        <div className="order-2 md:order-3 ml-2 mt-0">
          <button
            onClick={showModal}
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded"
          >
            Upload Media
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen">
        {loading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : users.length > 0 ? (
          <div className="flex flex-wrap justify-center">
            {users.map((it, index) => (
              <div key={index} className="mt-6 p-4 relative z-10 rounded-xl shadow-xl">
                {it.mediaType.startsWith('audio/') ? (
                  <div className="bg-white border-slate-100 dark:bg-slate-800 border-b rounded-t-xl p-4 pb-6 sm:p-10 sm:pb-8 lg:p-6 xl:p-10 xl:pb-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8">
                    <div className="flex items-center space-x-4">
                    <Audio
                     height="120"
                     width="100"
                     radius="9"
                     color="green"
                     ariaLabel="loading"
                     wrapperStyle
                     wrapperClass
                   />
                      <div className="min-w-0 flex-auto space-y-1 font-semibold">
                        <h2 className="text-slate-500 dark:text-slate-400 text-sm leading-6 truncate">
                          {it.title}
                        </h2>
                        <p className="text-slate-900 dark:text-slate-50 text-lg">
                          Full Stack Radio
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <div className="bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <audio controls className="w-full p-4">
                            <source src={it.file} />
                          </audio>
                        </div>
                      </div>
                      <div className="flex justify-evenly px-6 pt-4 pb-2">
                        <button onClick={() => deleteMedia(it?._id)} className="bg-transparent hover:bg-blue-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Delete</button>
                        {token ? (
                           <Link href={`/updated-media/${it?._id}`}  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Update</Link>
                        ):("")}
                        {/* <Link href={`/updated-media/${it?._id}`}  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Update</Link> */}
                      </div>
                    </div>
                  </div>
                ) : it.mediaType.startsWith('video/') ? (
                  <div className="bg-white border-slate-100 dark:bg-slate-800 border-b rounded-t-xl p-4 pb-6 sm:p-10 sm:pb-8 lg:p-6 xl:p-10 xl:pb-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8">
                    <div className="flex items-center space-x-4">
                    
                    
                    </div>
                    <div className="space-y-2">
                      <div className="relative max-w-sm">
                        <div className="bg-slate-100 dark:bg-slate-700 ">
                        <video controls className="w-full">
                       <source src={it.file} />
                       Your browser does not support the video tag.
                     </video>
                        </div>
                        <div className="min-w-0 flex-auto space-y-1 font-semibold">
                        <div className="px-6 py-4">
                       <p className="text-gray-700 text-base">{it.title}</p>
                     </div>
                        
                      </div>
                      </div>
                      <div className="flex justify-evenly px-6 pt-4 pb-2">
                        <button onClick={() => deleteMedia(it?._id)} className="bg-transparent hover:bg-blue-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Delete</button>
                        {token ? (
                           <Link href={`/updated-media/${it?._id}`}  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Update</Link>
                        ):("")}
                        {/* <Link href={`/updated-media/${it?._id}`} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Update</Link> */}
                      </div>
                    </div>
                  </div>
                
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-screen">
            <h1 style={{ fontSize: "40px", color: "goldenrod" }}>Upload to show Data</h1>
            <dotlottie-player
              src="https://lottie.host/eca942ec-435f-40aa-8aad-83d6105cc018/sK0xeE8Fj3.json"
              background="transparent"
              speed="1"
              style={{ width: '600px', height: '800px' }}
              loop
              autoplay
            ></dotlottie-player>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <UploadComponent
              onClose={closeModal}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              register={register}
              errors={errors}
              loading={loading}
            />
          </div>
        </div>
      )}
    </>
  );
}
