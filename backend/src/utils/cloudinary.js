import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim()
};

cloudinary.config({
    ...cloudinaryConfig
});

const removeLocalFile = (localFilePath) => {
    if (localFilePath && fs.existsSync(localFilePath)) {
        try {
            fs.unlinkSync(localFilePath);
        } catch (error) {
            console.error("Failed to remove temporary upload file:", {
                path: localFilePath,
                message: error.message
            });
        }
    }
};

const getCloudinaryUploadFailureMessage = (error) => {
    const statusCode = error?.http_code || error?.statusCode;

    if (statusCode === 401 || statusCode === 403) {
        return "Cloudinary rejected the upload. Verify that the API key is active, uploads are enabled for this Cloudinary product environment, and the account is not restricted.";
    }

    return error?.message || "Unknown Cloudinary upload error";
};

const getUploadedResource = async (uploadResult, resourceType) => {
    console.info("[upload-debug] Cloudinary upload result:", {
        requestedResourceType: resourceType,
        resultResourceType: uploadResult?.resource_type,
        secureUrl: uploadResult?.secure_url || null,
        publicId: uploadResult?.public_id || null,
        hasDuration: uploadResult?.duration !== undefined,
        resultKeys: uploadResult ? Object.keys(uploadResult) : []
    });

    if (uploadResult?.secure_url) {
        return uploadResult;
    }

    if (!uploadResult?.public_id) {
        return uploadResult;
    }

    const resource = await cloudinary.api.resource(uploadResult.public_id, {
        resource_type: resourceType,
        type: "upload",
        media_metadata: true
    });

    console.info("[upload-debug] Cloudinary resource lookup result:", {
        requestedResourceType: resourceType,
        resultResourceType: resource?.resource_type,
        secureUrl: resource?.secure_url || null,
        publicId: resource?.public_id || null,
        hasDuration: resource?.duration !== undefined
    });

    return {
        ...uploadResult,
        ...resource
    };
};

const uploadLargeVideo = (localFilePath, options) => new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
        localFilePath,
        options,
        (error, result) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        }
    );
});

const uploadOnCloudinary = async (localFilePath, resourceType = "image") => {
    try {
        if (!localFilePath) return null;
        if (Object.values(cloudinaryConfig).some((value) => !value)) {
            throw new Error(
                "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
            );
        }

        const options = {
            resource_type: resourceType,
            chunk_size: 6_000_000,
            media_metadata: resourceType === "video"
        };
        const result = resourceType === "video"
            ? await uploadLargeVideo(localFilePath, options)
            : await cloudinary.uploader.upload(localFilePath, options);

        const uploadedResource = await getUploadedResource(result, resourceType);
        console.info("[upload-debug] Cloudinary normalized upload:", {
            requestedResourceType: resourceType,
            resultResourceType: uploadedResource?.resource_type,
            secureUrl: uploadedResource?.secure_url || null,
            publicId: uploadedResource?.public_id || null,
            hasDuration: uploadedResource?.duration !== undefined
        });

        return uploadedResource;
    } catch (error) {
        const statusCode = error?.http_code || error?.statusCode;
        const reason = getCloudinaryUploadFailureMessage(error);

        const uploadError = new Error(`Cloudinary upload failed: ${reason}`);
        uploadError.statusCode = statusCode;
        console.error("Cloudinary upload failed:", {
            statusCode,
            errorName: error?.name,
            message: error?.message
        });
        throw uploadError;
    } finally {
        removeLocalFile(localFilePath);
    }
};

const deleteOnCloudinary = async (public_id, resource_type="image") => {
    try {
        if (!public_id) return null;

        return await cloudinary.uploader.destroy(public_id, {
            resource_type
        });
    } catch (error) {
        throw new Error(`Cloudinary deletion failed: ${error.message}`);
    }
};

export {
    uploadOnCloudinary,
    deleteOnCloudinary,
    getCloudinaryUploadFailureMessage,
    getUploadedResource,
    removeLocalFile
};
