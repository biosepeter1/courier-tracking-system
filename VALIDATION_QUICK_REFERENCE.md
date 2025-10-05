# Shipment Validation Quick Reference

## 🚀 Quick Start

### Endpoint
```
POST /api/shipments
Authorization: Bearer {admin_token}
Content-Type: application/json
```

### Minimal Valid Request
```json
{
  "sender": {
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St, City, State"
  },
  "receiver": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+0987654321",
    "address": "456 Oak Ave, City, State"
  },
  "origin": "New York, NY",
  "destination": "Los Angeles, CA"
}
```

---

## ✅ Required Fields Checklist

### Sender (4 fields, 1 optional)
- [x] `name` - 2-100 characters
- [x] `phone` - max 20 characters
- [x] `address` - max 500 characters
- [ ] `email` - valid email format *(OPTIONAL)*

### Receiver (4 fields, all required)
- [x] `name` - 2-100 characters
- [x] `email` - valid email format ⚠️ **REQUIRED**
- [x] `phone` - max 20 characters
- [x] `address` - max 500 characters

### Shipment Info (2 required)
- [x] `origin` - max 200 characters
- [x] `destination` - max 200 characters

### Optional Fields
- [ ] `packageDetails.weight` - number >= 0
- [ ] `packageDetails.dimensions` - {length, width, height}
- [ ] `packageDetails.description` - max 500 chars
- [ ] `packageDetails.value` - number >= 0
- [ ] `estimatedDelivery` - future date
- [ ] `priority` - Low|Normal|High|Urgent

---

## ❌ Common Validation Errors

### Error 1: Missing Receiver Email
```json
{
  "field": "receiver.email",
  "message": "\"receiver.email\" is required"
}
```
**Fix:** Add email to receiver object

### Error 2: Invalid Email Format
```json
{
  "field": "receiver.email",
  "message": "\"receiver.email\" must be a valid email"
}
```
**Fix:** Use valid email format (user@domain.com)

### Error 3: Name Too Short
```json
{
  "field": "sender.name",
  "message": "\"sender.name\" length must be at least 2 characters"
}
```
**Fix:** Ensure name has at least 2 characters

### Error 4: Missing Required Field
```json
{
  "field": "destination",
  "message": "\"destination\" is required"
}
```
**Fix:** Include all required fields

---

## 🔧 Testing the Validation

### Run Tests
```bash
node backend/test-validation.js
```

### Expected Output
```
✅ PASSED - Valid data accepted
✅ PASSED - Validation correctly rejected missing receiver email
✅ PASSED - Validation correctly rejected invalid email format
✅ PASSED - Validation correctly rejected missing required fields
```

---

## 📋 Field Constraints Summary

| Field | Type | Min | Max | Required | Format |
|-------|------|-----|-----|----------|--------|
| sender.name | string | 2 | 100 | ✅ | - |
| sender.phone | string | - | 20 | ✅ | - |
| sender.address | string | - | 500 | ✅ | - |
| sender.email | string | - | - | ❌ | email |
| receiver.name | string | 2 | 100 | ✅ | - |
| receiver.email | string | - | - | ✅ | email |
| receiver.phone | string | - | 20 | ✅ | - |
| receiver.address | string | - | 500 | ✅ | - |
| origin | string | - | 200 | ✅ | - |
| destination | string | - | 200 | ✅ | - |
| packageDetails.weight | number | 0 | - | ❌ | - |
| packageDetails.description | string | - | 500 | ❌ | - |
| packageDetails.value | number | 0 | - | ❌ | - |
| estimatedDelivery | date | now | - | ❌ | ISO 8601 |
| priority | string | - | - | ❌ | enum |

---

## 🎯 Key Points to Remember

1. **Receiver email is REQUIRED** - Don't forget this!
2. **Sender email is OPTIONAL** - Can be omitted
3. **Admin authentication required** - Only admins can create shipments
4. **Tracking number auto-generated** - Don't send it in request
5. **Two-layer validation** - Joi middleware + Mongoose model
6. **Error responses include field names** - Easy to debug

---

## 📚 Related Documentation

- **Full Documentation:** `SHIPMENT_VALIDATION_DOCUMENTATION.md`
- **Verification Summary:** `VERIFICATION_SUMMARY.md`
- **Test File:** `backend/test-validation.js`

---

## 🆘 Quick Troubleshooting

**Q: Why is my request failing with 401?**  
A: You need admin authentication. Include `Authorization: Bearer {token}` header.

**Q: Why is my request failing with 400?**  
A: Check validation errors in response. Ensure all required fields are present.

**Q: Can I omit sender email?**  
A: Yes, sender email is optional.

**Q: Can I omit receiver email?**  
A: No, receiver email is required for notifications.

**Q: What happens if I don't send a tracking number?**  
A: The system auto-generates one (format: CT{timestamp}{random}).

**Q: Can I set the status when creating a shipment?**  
A: No, status always starts as "Pending" and is updated via separate endpoint.

---

## 📞 Support

For more details, see:
- Validation middleware: `backend/middleware/validation.js`
- Controller: `backend/controllers/shipmentController.js`
- Model: `backend/models/Shipment.js`
- Routes: `backend/routes/shipments.js`
