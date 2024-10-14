"use client";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import mammoth from "mammoth";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

export default function FileViewer({ fileUrl, fileType }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetchFile(fileUrl, fileType);
  }, [fileUrl, fileType]);

  const fetchFile = async (url, type) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      if (type.startsWith("image")) {
        setContent(URL.createObjectURL(blob));
      } else if (type.startsWith("video")) {
        setContent(URL.createObjectURL(blob));
      } else if (type === "application/pdf") {
        setContent(URL.createObjectURL(blob));
      } else if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await blob.arrayBuffer();
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        setContent(value);
      } else if (type === "text/csv") {
        const text = await blob.text();
        const csvData = Papa.parse(text, { header: true });
        setContent(csvData.data);
      } else {
        const markdownText = await blob.text();
        setContent(markdownText);
      }
    } catch (error) {
      console.error("Error fetching the file:", error);
      setContent("Error loading file.");
    }
  };

  const renderFile = () => {
    switch (fileType) {
      case "image/jpeg":
      case "image/png":
      case "image/gif":
        return <Image src={content} alt="File content" className="max-w-full h-auto" style={{ width: '99vw'}} width={Number(innerWidth)} height="500" />;
      case "video/mp4":
      case "video/webm":
        return (
          <video controls className="w-full h-full">
            <source src={content} type={fileType} />
            Your browser does not support the video tag.
          </video>
        );
      case "application/pdf":
        return (
          <object data={content} type="application/pdf" width="100%" height="100%">
            <p>Your browser does not support PDFs. <a href={content}>Download the PDF</a>.</p>
          </object>
        );
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <div className="whitespace-pre-wrap">{content}</div>;
      case "text/csv":
        return (
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr>
                {content && content.length > 0 && Object.keys(content[0]).map((key) => (
                  <th key={key} className="border border-gray-300 px-4 py-2">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content && content.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx} className="border border-gray-300 px-4 py-2">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "text/markdown":
        return <ReactMarkdown>{content}</ReactMarkdown>;
      case "text/plain":
      default:
        return <pre className="text-wrap" style={{ lineBreak: "anywhere"}}>{content}</pre>;
    }
  };

  return (
    <div className="file-viewer p-4 border rounded shadow-sm w-full min-h-[90vh]">
      {content ? renderFile() : <p>Loading file...</p>}
    </div>
  );
}
