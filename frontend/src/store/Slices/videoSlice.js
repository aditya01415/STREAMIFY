import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    loading: false,
    uploading: false,
    uploaded: false,
    videos: {
        docs: [],
        hasNextPage: false,
    },
    video: null,
    publishToggled: false,
};

export const getAllVideos = createAsyncThunk(
    "getAllVideos",
    async ({ userId, sortBy, sortType, query, page, limit }) => {
        try {
            const params = {};

            if (userId) params.userId = userId;
            if (query) params.query = query;
            if (page) params.page = page;
            if (limit) params.limit = limit;
            if (sortBy && sortType) {
                params.sortBy = sortBy;
                params.sortType = sortType;
            }

            const response = await axiosInstance.get("/video", { params });

            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    }
);

export const publishAvideo = createAsyncThunk("publishAvideo", async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("videoFile", data.videoFile[0]);
    formData.append("thumbnail", data.thumbnail[0]);
    console.info("[upload-debug] Frontend FormData:", {
        fields: ["title", "description", "videoFile", "thumbnail"],
        videoFile: {
            name: data.videoFile[0]?.name || null,
            type: data.videoFile[0]?.type || null,
            size: data.videoFile[0]?.size || null
        },
        thumbnail: {
            name: data.thumbnail[0]?.name || null,
            type: data.thumbnail[0]?.type || null,
            size: data.thumbnail[0]?.size || null
        }
    });

    try {
        // Let the browser/Axios set the multipart boundary for this FormData request.
        const response = await axiosInstance.post("/video", formData);
        console.info("[upload-debug] Frontend upload response:", {
            status: response.status,
            success: response.data?.success,
            videoId: response.data?.data?._id || null,
            videoUrl: response.data?.data?.videoFile?.url || null,
            videoPublicId: response.data?.data?.videoFile?.public_id || null,
            responseKeys: response.data ? Object.keys(response.data) : []
        });
        toast.success(response?.data?.message);
        return response.data.data;
    } catch (error) {
        console.error("[upload-debug] Frontend upload error response:", {
            status: error?.response?.status || null,
            error: error?.response?.data?.error || error?.message || null,
            responseKeys: error?.response?.data
                ? Object.keys(error.response.data)
                : []
        });
        toast.error(error?.response?.data?.error);
        throw error;
    }
});

export const updateAVideo = createAsyncThunk(
    "updateAVideo",
    async ({ videoId, data }) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("thumbnail", data.thumbnail[0]);

        try {
            const response = await axiosInstance.patch(
                `/video/v/${videoId}`,
                formData
            );
            toast.success(response?.data?.message);
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    }
);

export const deleteAVideo = createAsyncThunk(
    "deleteAVideo",
    async (videoId) => {
        try {
            const response = await axiosInstance.delete(`/video/v/${videoId}`);
            toast.success(response?.data?.message);
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    }
);

export const getVideoById = createAsyncThunk(
    "getVideoById",
    async ({ videoId }) => {
        try {
            const response = await axiosInstance.get(`/video/v/${videoId}`);
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    }
);

export const togglePublishStatus = createAsyncThunk(
    "togglePublishStatus",
    async (videoId) => {
        try {
            const response = await axiosInstance.patch(
                `/video/toggle/publish/${videoId}`
            );
            toast.success(response.data.message);
            return response.data.data.isPublished;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    }
);

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        updateUploadState: (state) => {
            state.uploading = false;
            state.uploaded = false;
        },
        makeVideosNull: (state) => {
            state.videos.docs = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllVideos.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllVideos.fulfilled, (state, action) => {
            state.loading = false;
            state.videos.docs = [...state.videos.docs, ...action.payload.docs];
            state.videos.hasNextPage = action.payload.hasNextPage;
        });
        builder.addCase(publishAvideo.pending, (state) => {
            state.uploading = true;
        });
        builder.addCase(publishAvideo.fulfilled, (state) => {
            state.uploading = false;
            state.uploaded = true;
        });
        builder.addCase(publishAvideo.rejected, (state) => {
            state.uploading = false;
        });
        builder.addCase(updateAVideo.pending, (state) => {
            state.uploading = true;
        });
        builder.addCase(updateAVideo.fulfilled, (state) => {
            state.uploading = false;
            state.uploaded = true;
        });
        builder.addCase(updateAVideo.rejected, (state) => {
            state.uploading = false;
        });
        builder.addCase(deleteAVideo.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteAVideo.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(getVideoById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getVideoById.fulfilled, (state, action) => {
            state.loading = false;
            state.video = action.payload;
        });
        builder.addCase(togglePublishStatus.fulfilled, (state) => {
            state.publishToggled = !state.publishToggled;
        });
    },
});

export const { updateUploadState, makeVideosNull } = videoSlice.actions;

export default videoSlice.reducer;
