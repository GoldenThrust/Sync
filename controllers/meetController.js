import process from "process";

class MeetController {
    initiate(req, res) {
        const id = req.params.id;
        return res.redirect(`${process.env.DEV_URL}meet/room/` + id)
    }
}
const meetController = new MeetController();
export default meetController;