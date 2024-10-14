# Document Hub

**Document Hub** is a simple and secure web application that allows users to upload, share, and access files through email links. Utilizing the **Pinata Web3 SDK**, Document Hub leverages decentralized storage to securely store and manage documents, ensuring privacy and control.

## Features

- **Upload Documents:** Users can upload various file types (PDFs, images, videos, etc.) to the platform.
- **Decentralized Storage:** Documents are stored on IPFS via the Pinata Web3 SDK, ensuring decentralized and secure file storage.
- **Share via Email:** Users can easily share documents with others through an email containing a direct link to the file. Recipients do not need to be logged into the app to access the shared file.
- **Easy Access:** Recipients can open and download shared files directly from the email, no login or signup required.

## Getting Started

Follow these steps to get Document Hub running locally on your machine.

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [Pinata API key](https://www.pinata.cloud/)
- [Next.js](https://nextjs.org/)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/document-hub.git
    cd document-hub
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:  
   Create a `.env` file in the root directory and add your Pinata API keys and other configuration variables:
    ```bash
    PINATA_API_KEY=your-pinata-api-key
    PINATA_SECRET_API_KEY=your-pinata-secret-key
    BASE_URL=http://localhost:3000
    ```

4. **Run the application**:
    ```bash
    npm run dev
    ```

5. **Open the application in your browser**:
    ```bash
    http://localhost:3000
    ```

### How It Works

- **Upload a Document**: Users can upload their files from the homepage. Once uploaded, the file is stored on IPFS via the Pinata Web3 SDK.
- **Share Files**: After uploading a document, users can input the recipient's email and share the file. The recipient will receive an email with a direct link to the file.
- **Access Shared Files**: Recipients can access shared files via the link in their email without needing to log into the app.

## Tech Stack

- **Frontend**: Next.js (React framework), Tailwind CSS for styling
- **Backend**: Node.js, Express.js for handling API requests
- **Storage**: Pinata Web3 SDK for storing files on IPFS
- **Email Service**: Nodemailer or any other SMTP provider for sending emails

## File Types Supported

Document Hub supports the following file types:
- PDFs
- Images (JPEG, PNG, GIF)
- Videos (MP4, WebM)
- CSVs
- Word Documents (DOCX)
- Plain text
- Markdown

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any features, bug fixes, or enhancements.

