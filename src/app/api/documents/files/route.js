import getSession from "@/app/utils/getSession";
import { Document } from "@/model/Document";
import { Group } from "@/model/Group";

export async function GET(req) {
    const session = await getSession();

    if (!session) {
        return new Response(JSON.stringify({
            message: 'Unauthorized',
            status: 'Error',
        }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const searchParams = req.nextUrl.searchParams;
    const gid = searchParams.get('gid');

    if (!gid) {
        return new Response(JSON.stringify({
            message: 'Group ID not provided',
            status: 'Error',
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const group = await Group.findOne({ id: gid }).populate('user');
    
        if (!group) {
            return new Response(JSON.stringify({
                message: 'Group not found',
                status: 'Error',
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    
        const reqByOwner = group.user?.email === session.user.email;
        console.log( group.user, group.user.id, group.user.email, session.user.email);
    
        const documents = await Document.find({ group });
    
        const formattedDocuments = documents
            .filter(document => reqByOwner || document.visibility === 'public')
            .map(document => ({
                ...document._doc,
                user: group.user.email,
                reqByOwner
            }));
    
        return new Response(JSON.stringify({
            documents: formattedDocuments,
            status: 'Ok',
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Server error',
            error: error.message,
            status: 'Error',
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
