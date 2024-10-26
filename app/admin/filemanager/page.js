'use client';

import { useState, useEffect } from 'react';

const FileManager = () => {
    const [fileManagerData, setFileManagerData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/filemanager-data');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setFileManagerData(data);
            } catch (err) {
                console.error('Error fetching file manager data:', err);
                setError('Failed to load file manager data');
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!fileManagerData) {
        return <div>Loading...</div>;
    }

    // Render your file manager component using fileManagerData
    return (
        <div className="file-manager">
            <h1>File Manager</h1>
            {/* Replace this with your actual file manager UI */}
            <pre>{JSON.stringify(fileManagerData, null, 2)}</pre>
        </div>
    );
};

export default FileManager;
