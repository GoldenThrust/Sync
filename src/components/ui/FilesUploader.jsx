"use client"

import { useState } from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';


const FileUploader = () => {
  const [files, setFiles] = useState([]);

  return (
    <div className='space-y-3'>
      <div className='w-full bg-slate-800 flex justify-center place-items-center h-14 rounded-xl'>
        Create a File
      </div>
      <FilePond
        files={files}
        allowMultiple={true}
        onupdatefiles={setFiles}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        server="/api/documents/upload"
      />
    </div>
  );
};

export default FileUploader;
