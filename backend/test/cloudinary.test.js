import test from "node:test";
import assert from "node:assert/strict";
import { getCloudinaryUploadFailureMessage } from "../src/utils/cloudinary.js";

test("maps Cloudinary authorization failures to a safe diagnostic", () => {
    assert.match(
        getCloudinaryUploadFailureMessage({ http_code: 403 }),
        /Cloudinary rejected the upload/
    );
});

test("preserves non-authorization Cloudinary errors", () => {
    assert.equal(
        getCloudinaryUploadFailureMessage({ http_code: 500, message: "timeout" }),
        "timeout"
    );
});
