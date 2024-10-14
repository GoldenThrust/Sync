

import {
    EmailShareButton,
} from 'next-share';
import { Share2 } from 'lucide-react';

export default function Share({ link, emailBody }) {
    const emailSubject = `You've received a document via Document Hub!`;
    navigator.clipboard.writeText(link)

    return (
        <div className="flex space-x-3">
            <EmailShareButton
                url={link}
                subject={emailSubject}
                body={emailBody}
            >
                <div className="flex flex-row">
                    <Share2 className="mr-2 h-4 w-4 text-blue-600" /> Share
                </div>
            </EmailShareButton>
        </div>
    );
}