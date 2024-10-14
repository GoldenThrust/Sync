import { pinata } from "@/app/utils/constant";
import getSession from "@/app/utils/getSession";
import { Group } from "@/model/Group";
import { defaultGroupId } from "@/app/utils/constant";

export async function GET() {
    const session = await getSession();

    const groups = await Group.find({ user: session.user.id });

    const formattedGroups = groups.map(group => ({
        ...group._doc,
        user: session.user.email
    }));

    return new Response(JSON.stringify({
        groups: formattedGroups,
        status: 'Ok',
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function POST(req) {
    const session = await getSession();
    const groupName = await req.text();

    if (!groupName) {
        return new Response(JSON.stringify({
            error: 'Group name is required',
            status: 'Error',
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const pinataGroup = await pinata.groups.create({
        name: groupName,
    });


    const group = new Group({ name: groupName, id: pinataGroup.id , user: session.user.id });
    await group.save();

    return new Response(JSON.stringify({
        group: pinataGroup,
        status: 'Ok',
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}



export async function DELETE(req) {
    const session = await getSession();
    const gid = await req.text();

    if (!gid) {
        return new Response(JSON.stringify({
            error: 'Group ID is required',
            status: 'Error',
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    if (defaultGroupId === gid) {
        return new Response(JSON.stringify({
            error: 'Cannot delete default group',
            status: 'Error',
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const group = await Group.deleteOne({ id: gid, user: session.user.id });

    if (group.deletedCount > 0) {
        await pinata.groups.delete({
            groupId: gid,
        });
    } else {
        return new Response(JSON.stringify({
            error: 'Group not found or not authorized to delete',
            status: 'Error',
        }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    return new Response(JSON.stringify({
        status: 'Ok',
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
