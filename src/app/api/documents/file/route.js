import { pinata } from "@/app/utils/constant";
import getSession from "@/app/utils/getSession";
import { Document } from "@/model/Document";

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
    const cid = searchParams.get('cid');

    if (!cid) {
        return new Response(JSON.stringify({
            message: 'CID not provided',
            status: 'Error',
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const document = await Document.findOne({ cid });

        if (!document) {
            return new Response(JSON.stringify({
                message: 'Document not found',
                status: 'Error',
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const reqByOwner = document.group?.user?.email === session.user.email;

        if (reqByOwner || document.visibility === 'public') {
            const pinataResponse = await pinata.gateways.get(cid);
            console.log(pinataResponse);
            
            const contentType = pinataResponse.contentType;
            const data = pinataResponse.data;

            return new Response(JSON.stringify({
                document,
                user: document.group?.user?.email,
                reqByOwner,
                data,
                contentType,
                status: 'Ok',
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
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
