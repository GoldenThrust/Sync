export async function fetchData() {
    try {
        const response = await fetch('/api/documents/group');
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching documents:", error);
    }
}


export function truncateMiddle(text, startChars, endChars, maxLength) {
    if (text.length <= maxLength) return text;
    
    const start = text.slice(0, startChars);
    const end = text.slice(-endChars); 
    return `${start}...${end}`;
}
