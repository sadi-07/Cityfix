import axios from "axios";

export const imageUpload = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const res = await axios.post(
            `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
            formData
        );

        
        return res.data.data.display_url;

    } catch (err) {
        console.error("Image Upload Error:", err);
        throw err;
    }
};
