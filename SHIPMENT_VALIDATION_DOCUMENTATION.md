# Shipment Creation Validation Documentation

## Overview
The shipment creation endpoint uses a **two-layer validation approach** to ensure data integrity before saving to the database.

---

## Validation Flow

```
Client Request → Joi Validation (Middleware) → Mongoose Validation (Model) → Database
```

### Layer 1: Joi Validation Middleware
**Location:** `backend/middleware/validation.js` (lines 60-88)

**Applied in route:** `POST /api/shipments` via `validate(createShipmentSchema)` middleware

**Validation Rules:**

#### Sender Object (Required)
```javascript
sender: {
  name: string (min: 2, max: 100) - REQUIRED
  phone: string (max: 20) - REQUIRED
  address: string (max: 500) - REQUIRED
  email: string (valid email format) - OPTIONAL
}
```

#### Receiver Object (Required)
```javascript
receiver: {
  name: string (min: 2, max: 100) - REQUIRED
  email: string (valid email format) - REQUIRED ⚠️
  phone: string (max: 20) - REQUIRED
  address: string (max: 500) - REQUIRED
}
```

#### Location Fields (Required)
```javascript
origin: string (max: 200) - REQUIRED
destination: string (max: 200) - REQUIRED
```

#### Package Details (Optional)
```javascript
packageDetails: {
  weight: number (min: 0) - OPTIONAL
  dimensions: {
    length: number (min: 0) - OPTIONAL
    width: number (min: 0) - OPTIONAL
    height: number (min: 0) - OPTIONAL
  } - OPTIONAL
  description: string (max: 500) - OPTIONAL
  value: number (min: 0) - OPTIONAL
} - OPTIONAL
```

#### Additional Fields (Optional)
```javascript
estimatedDelivery: Date (must be >= now) - OPTIONAL
priority: enum ['Low', 'Normal', 'High', 'Urgent'] - OPTIONAL (defaults to 'Normal')
```

---

### Layer 2: Mongoose Model Validation
**Location:** `backend/models/Shipment.js`

### Auto-Generated Fields
- `trackingNumber`: **Optional** - Auto-generated if not provided (format: `CT{6-digit-timestamp}{6-char-random}`)
  - ⚠️ **Important:** Field is NOT required in either Joi or Mongoose - generated in pre-save hook
- `status`: Defaults to 'Pending'
- `createdBy`: Set from authenticated user (`req.user._id`)
- `createdAt`/`updatedAt`: Automatically managed by Mongoose timestamps

#### Additional Constraints
- Email format validation using regex: `/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/`
- Coordinates validation (if provided):
  - Latitude: -90 to 90
  - Longitude: -180 to 180

---

## Error Response Format

### Joi Validation Errors (HTTP 400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "receiver.email",
      "message": "\"receiver.email\" is required"
    }
  ]
}
```

### Mongoose Validation Errors (HTTP 400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "receiver.email",
      "message": "Receiver email is required"
    }
  ]
}
```

### Duplicate Tracking Number (HTTP 409)
```json
{
  "success": false,
  "message": "Tracking number already exists"
}
```

---

## Route Configuration
**File:** `backend/routes/shipments.js` (line 28)

```javascript
router.post('/', 
  requireAdmin,                          // Only admins can create shipments
  validate(createShipmentSchema),        // Joi validation middleware
  createShipment                         // Controller function
);
```

---

## Controller Logic
**File:** `backend/controllers/shipmentController.js` (lines 6-69)

### Process Flow:
1. Extract shipment data from `req.body`
2. Add `createdBy` from authenticated user
3. Create new Shipment instance (triggers Mongoose validation)
4. Geocode origin address for coordinates
5. Add initial history entry (status: 'Pending')
6. Save to database
7. Populate creator details
8. Return success response with shipment data

### Special Handling:
- **Geocoding**: The origin address is geocoded to get lat/lng coordinates
- **History Tracking**: Initial history entry is created automatically
- **Error Handling**: Comprehensive error handling for validation, duplicate keys, and server errors

---

## Example Valid Request

```json
POST /api/shipments
Authorization: Bearer {admin_token}

{
  "sender": {
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St, New York, NY 10001",
    "email": "john@example.com"
  },
  "receiver": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+0987654321",
    "address": "456 Oak Ave, Los Angeles, CA 90001"
  },
  "origin": "New York, NY",
  "destination": "Los Angeles, CA",
  "packageDetails": {
    "weight": 2.5,
    "dimensions": {
      "length": 30,
      "width": 20,
      "height": 15
    },
    "description": "Electronics",
    "value": 500
  },
  "estimatedDelivery": "2025-10-10T00:00:00Z",
  "priority": "High"
}
```

---

## Key Takeaways

✅ **Two-layer validation** ensures robust data integrity  
✅ **Receiver email is REQUIRED** (important for notifications)  
✅ **Sender email is OPTIONAL**  
✅ **Only admins** can create shipments  
✅ **Tracking numbers** are auto-generated  
✅ **Geocoding** happens automatically for location tracking  
✅ **History tracking** starts immediately with "Pending" status  

---

## Related Files

- Validation Middleware: `backend/middleware/validation.js`
- Shipment Controller: `backend/controllers/shipmentController.js`
- Shipment Model: `backend/models/Shipment.js`
- Routes: `backend/routes/shipments.js`
- Geocoding Utility: `backend/utils/geocoding.js`
- Email Notification: `backend/utils/email.js`
