
package com.cloud_in_backend.cloud_in_backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
public class Mediacontroller {

    @Autowired
    private Cloudinary cloudinary;

    @PostMapping("/api/media/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile image) {
        try {
            // Upload image to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());

            // Get the secure URL of the uploaded image
            String url = (String) uploadResult.get("secure_url");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "url", url
            ));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }








    @DeleteMapping("/api/media/delete")
    public ResponseEntity<?> deleteImage(@RequestBody Map<String, String> payload) {
        String imageUrl = payload.get("url");

        System.out.println("[INFO] Received delete request for URL: " + imageUrl);

        if (imageUrl == null || imageUrl.isEmpty()) {
            System.out.println("[ERROR] Missing image URL in request");
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Missing image URL"
            ));
        }

        try {
            String publicId = extractPublicIdFromUrl(imageUrl);
            System.out.println("[DEBUG] Extracted public ID: " + publicId);

            if (publicId == null || publicId.isEmpty()) {
                System.out.println("[ERROR] Failed to extract public ID from URL");
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Invalid image URL"
                ));
            }

            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            System.out.println("[DEBUG] Cloudinary destroy response: " + result);

            String status = (String) result.get("result");

            if ("ok".equals(status)) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Image deleted successfully"
                ));
            } else {
                return ResponseEntity.status(500).body(Map.of(
                        "success", false,
                        "error", "Cloudinary deletion failed",
                        "details", result
                ));
            }

        } catch (Exception e) {
            e.printStackTrace(); // Log full stack trace
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "error", "Server error",
                    "details", e.getMessage()
            ));
        }
    }

    private String extractPublicIdFromUrl(String url) {
        try {
            // Example: https://res.cloudinary.com/demo/image/upload/v1717998499/rj1mdrejumfwqesourzp.jpg
            String[] parts = url.split("/upload/");
            if (parts.length != 2) return null;

            String path = parts[1]; // e.g. v1717998499/rj1mdrejumfwqesourzp.jpg
            String[] pathParts = path.split("/");
            String fileNameWithExt = pathParts[pathParts.length - 1];

            // Remove file extension
            String publicId = fileNameWithExt.substring(0, fileNameWithExt.lastIndexOf('.'));
            System.out.println("[DEBUG] File name without extension: " + publicId);

            // Prepend folders if they exist (ignore version folder like "v123...")
            if (pathParts.length > 1) {
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < pathParts.length - 1; i++) {
                    if (!pathParts[i].matches("^v\\d+$")) { // skip version folder
                        sb.append(pathParts[i]).append("/");
                    }
                }
                sb.append(publicId);
                return sb.toString();
            }

            return publicId;
        } catch (Exception e) {
            e.printStackTrace(); // Log exact error
            return null;
        }
    }



}