import Settings from "../models/settings.js";

class SettingsController {
    async initiate(req, res) {
        const { audio, video } = req.body;

        try {
            let settings = await Settings.findOne({ user: req.user });

            if (settings) {
                settings.audio = audio;
                settings.video = video;
                await settings.save();
            } else {
                const newSettings = new Settings({ user: req.user, audio, video });
                await newSettings.save();
            }

            return res.json({ status: 'OK' });
        } catch (error) {
            console.error("Error initiating settings:", error);
            return res.status(500).json({ status: 'ERROR', message: error.message });
        }
    }

    async update(req, res) {
        const { audio = {}, video = {}, enabledAudio, enabledVideo } = req.body;

        try {
            const settings = await Settings.findOne({ user: req.user });

            if (!settings) {
                return res.status(404).json({ status: 'ERROR', message: 'Settings not found' });
            }

            const updatedSettings = {
                audio: { ...settings.audio, ...audio },
                video: { ...settings.video, ...video },
                enabledAudio: (enabledAudio === null || enabledAudio === undefined) ? settings.enabledAudio : enabledAudio,
                enabledVideo: (enabledVideo === null || enabledVideo === undefined) ? settings.enabledVideo : enabledVideo,
            } 
            
            
            await Settings.findOneAndUpdate(
                { user: req.user },
                updatedSettings,
                { new: true }
            );

            return res.json({ status: 'OK' });
        } catch (error) {
            console.error("Error updating settings:", error);
            return res.status(500).json({ status: 'ERROR', message: error.message });
        }
    }

    async getSettings(req, res) {
        try {
            const settings = await Settings.findOne({ user: req.user });

            if (!settings) {
                return res.status(404).json({ status: 'ERROR', message: 'Settings not found' });
            }

            return res.json({ status: 'OK', settings, user: req.user });
        } catch (error) {
            console.error("Error retrieving settings:", error);
            return res.status(500).json({ status: 'ERROR', message: error.message });
        }
    }
}

export default new SettingsController();
