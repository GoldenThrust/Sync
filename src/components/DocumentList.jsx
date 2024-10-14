"use client"
import Document from '@/components/ui/DocumentGroup'

export default function DocumentList({ data, onDelete }) {
    return (
        <div className='space-y-2 overflow-auto max-h-full'>
            {data.length > 0 ? (
                data.map((options) => (
                    <Document
                        key={options.id}
                        docname={options.name}
                        gid={options.id}
                        properties={{
                            'Group ID': options.id,
                            'Owner': options.user,
                            'Created at': new Date(options.createdAt).toLocaleDateString(),
                        }}
                        onDelete={onDelete(options.id)}
                    />
                ))
            ) : (
                <p>Loading documents...</p>
            )}
        </div>
    );
}
