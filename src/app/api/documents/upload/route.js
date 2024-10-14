import { pinata } from "@/app/utils/constant";
import getSession from "@/app/utils/getSession";
import { Document } from "@/model/Document";
import { Group } from "@/model/Group";
import { User } from "@/model/User";
import { defaultGroupId } from "@/app/utils/constant";

export async function POST(request) {
  try {
    const session = await getSession();
    const formData = await request.formData();
    const filepond = formData.getAll('filepond');

    if (!filepond || !Array.isArray(filepond) || filepond.length === 0) {
      return new Response(JSON.stringify({
        error: 'Invalid filepond data',
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const file = filepond[1]; 

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({
        error: 'No file uploaded',
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const result = await pinata.upload.file(file).group(defaultGroupId);

    const user = await User.findOne({ email: session.user.email });
    let group = await Group.findOne({ id: defaultGroupId });

    if (!group) {
      group = new Group({ id: defaultGroupId, name: 'default', user });
      await group.save();
    }

    if (!result.isDuplicate) {
      const newDocument = new Document({ name: file.name, group, cid: result.IpfsHash });
      await newDocument.save();
    }

    return new Response(JSON.stringify({
      message: 'File upload and pinning successful',
      ipfsHash: result.IpfsHash,
      group: 'default'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error uploading file and pinning to Pinata:', error);
    return new Response(`File upload error: ${error.message}`, {
      status: 500,
    });
  }
}
