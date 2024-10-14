"use client"
import { truncateMiddle } from "@/app/utils/functions";
import { File } from "@/components/ui/File";

export default function FileList({ data, groups, onDelete }) {
    return (
        <div className='flex flex-wrap gap-3'>
            {data.length > 0 ? (
                data.map((options) => (
                    <File filename={truncateMiddle(options.name, 10, 7, 10)} visibility={options.visibility}
                    visibility_type={options.visibility_type}
                    groups={groups}
                    key={options.cid}
                    cid={options.cid}
                    properties={{
                        'Group ID': options.cid,
                        'Owner': options.user,
                        'Created at': new Date(options.createdAt).toLocaleDateString(),
                    }}
                    owner={options.reqByOwner}
                    onDelete={onDelete(options.id)} />
                ))
            ) : (
                <p>Loading documents...</p>
            )}
        </div>
    );
}
