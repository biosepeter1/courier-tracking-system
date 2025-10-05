# Profile Image Upload Feature

## Overview
Users can now upload their profile images directly from the Profile page. The feature includes image validation, preview, and automatic upload functionality.

## Features Implemented

### Backend Changes

1. **Multer Integration**
   - Installed `multer` package for handling multipart/form-data
   - Created upload middleware at `backend/middleware/upload.js`
   - Configured file storage in `backend/uploads/profile-images/`

2. **User Model Update**
   - Added `profileImage` field to User schema (stores image URL path)

3. **New API Endpoint**
   - `POST /api/auth/profile/upload-image`
   - Accepts multipart/form-data with `profileImage` field
   - Validates file type (jpeg, jpg, png, gif, webp)
   - Validates file size (max 5MB)
   - Automatically deletes old profile image when new one is uploaded
   - Protected route (requires authentication)

4. **Static File Serving**
   - Configured Express to serve uploaded images from `/uploads` endpoint
   - Images accessible at `http://localhost:5000/uploads/profile-images/filename.jpg`

5. **Updated Auth Controller**
   - Modified all user response objects to include `profileImage` field
   - Added `uploadProfileImage` controller function

### Frontend Changes

1. **API Integration**
   - Added `uploadProfileImage` function to `authAPI` in `src/lib/api.js`
   - Handles multipart/form-data with proper headers

2. **Profile Page UI**
   - Added camera button overlay on profile image
   - Click to upload new image
   - Real-time image preview while uploading
   - Loading spinner during upload
   - Success/error notifications
   - Displays uploaded profile image or default user icon

3. **Validation**
   - Client-side validation for file type
   - Client-side validation for file size (5MB max)
   - User-friendly error messages

## How to Use

### For Users

1. **Navigate to Profile Page**
   - Click on "Profile" in the sidebar navigation

2. **Upload Profile Image**
   - Click the camera icon button on your profile picture
   - Select an image file from your device
   - Supported formats: JPEG, JPG, PNG, GIF, WebP
   - Max file size: 5MB
   - Image will upload automatically
   - Success message will appear when upload is complete

3. **View Profile Image**
   - Your profile image will be displayed on the Profile page
   - The image persists across sessions

### For Developers

#### Testing the Upload Endpoint

Using curl:
```bash
curl -X POST http://localhost:5000/api/auth/profile/upload-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profileImage=@/path/to/image.jpg"
```

Using Postman:
1. Set method to POST
2. URL: `http://localhost:5000/api/auth/profile/upload-image`
3. Add Authorization header with Bearer token
4. In Body tab, select "form-data"
5. Add key "profileImage" with type "File"
6. Select image file to upload

#### File Storage Structure
```
backend/
└── uploads/
    └── profile-images/
        ├── .gitkeep
        ├── user-[userId]-[timestamp]-[random].jpg
        └── user-[userId]-[timestamp]-[random].png
```

#### Image URL Format
- Stored in database: `/uploads/profile-images/user-123-1234567890-999999999.jpg`
- Accessible via: `http://localhost:5000/uploads/profile-images/user-123-1234567890-999999999.jpg`

## Security Features

1. **File Type Validation**
   - Only image files are accepted (jpeg, jpg, png, gif, webp)
   - Validated by MIME type and file extension

2. **File Size Limit**
   - Maximum 5MB per image
   - Prevents large file uploads

3. **Authentication Required**
   - Only authenticated users can upload images
   - Users can only upload their own profile image

4. **Automatic Cleanup**
   - Old profile images are deleted when new ones are uploaded
   - Prevents disk space accumulation

5. **Unique Filenames**
   - Generated using userId + timestamp + random number
   - Prevents filename collisions

## Error Handling

The feature handles various error scenarios:
- Invalid file type → "Only image files are allowed..."
- File too large → "Image size must be less than 5MB"
- Network error → "Failed to upload image"
- No file selected → "No image file provided"

## Environment Variables

No additional environment variables needed. Uses existing:
- `VITE_API_BASE_URL` (frontend) - defaults to `http://localhost:5000/api`

## Git Configuration

- Uploaded images are excluded from version control
- `.gitignore` includes `uploads/` directory
- Directory structure preserved with `.gitkeep` file

## Browser Compatibility

Works on all modern browsers:
- Chrome, Firefox, Safari, Edge
- Supports drag-and-drop on compatible browsers
- Mobile-friendly (can use camera or gallery)

## Future Enhancements

Potential improvements:
- Image cropping/resizing on client side
- Multiple image formats with automatic conversion
- CDN integration for better performance
- Image compression before upload
- Drag-and-drop upload interface
- Profile image gallery/history
