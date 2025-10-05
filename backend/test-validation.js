// Quick test to verify validation middleware is properly configured
const { createShipmentSchema, validate } = require('./middleware/validation');

console.log('=== Shipment Validation Test ===\n');

// Test 1: Valid shipment data
const validData = {
  sender: {
    name: 'John Doe',
    phone: '+1234567890',
    address: '123 Main St, New York, NY 10001',
    email: 'john@example.com'
  },
  receiver: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+0987654321',
    address: '456 Oak Ave, Los Angeles, CA 90001'
  },
  origin: 'New York, NY',
  destination: 'Los Angeles, CA',
  packageDetails: {
    weight: 2.5,
    dimensions: {
      length: 30,
      width: 20,
      height: 15
    },
    description: 'Electronics',
    value: 500
  },
  priority: 'High'
};

console.log('Test 1: Valid shipment data');
const result1 = createShipmentSchema.validate(validData);
if (result1.error) {
  console.log('❌ FAILED - Unexpected validation error:');
  console.log(result1.error.details);
} else {
  console.log('✅ PASSED - Valid data accepted\n');
}

// Test 2: Missing receiver email (should fail)
const invalidData = {
  sender: {
    name: 'John Doe',
    phone: '+1234567890',
    address: '123 Main St'
  },
  receiver: {
    name: 'Jane Smith',
    // email: 'jane@example.com', // Missing required email
    phone: '+0987654321',
    address: '456 Oak Ave'
  },
  origin: 'New York, NY',
  destination: 'Los Angeles, CA'
};

console.log('Test 2: Missing receiver email (should fail)');
const result2 = createShipmentSchema.validate(invalidData);
if (result2.error) {
  console.log('✅ PASSED - Validation correctly rejected missing receiver email');
  console.log('Error:', result2.error.details[0].message + '\n');
} else {
  console.log('❌ FAILED - Should have rejected data without receiver email\n');
}

// Test 3: Invalid email format (should fail)
const invalidEmailData = {
  sender: {
    name: 'John Doe',
    phone: '+1234567890',
    address: '123 Main St',
    email: 'invalid-email' // Invalid format
  },
  receiver: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+0987654321',
    address: '456 Oak Ave'
  },
  origin: 'New York, NY',
  destination: 'Los Angeles, CA'
};

console.log('Test 3: Invalid email format (should fail)');
const result3 = createShipmentSchema.validate(invalidEmailData);
if (result3.error) {
  console.log('✅ PASSED - Validation correctly rejected invalid email format');
  console.log('Error:', result3.error.details[0].message + '\n');
} else {
  console.log('❌ FAILED - Should have rejected invalid email format\n');
}

// Test 4: Missing required fields (should fail)
const missingFieldsData = {
  sender: {
    name: 'John Doe',
    phone: '+1234567890'
    // Missing address
  },
  receiver: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+0987654321',
    address: '456 Oak Ave'
  },
  origin: 'New York, NY'
  // Missing destination
};

console.log('Test 4: Missing required fields (should fail)');
const result4 = createShipmentSchema.validate(missingFieldsData, { abortEarly: false });
if (result4.error) {
  console.log('✅ PASSED - Validation correctly rejected missing required fields');
  console.log('Errors found:', result4.error.details.length);
  result4.error.details.forEach(detail => {
    console.log(`  - ${detail.path.join('.')}: ${detail.message}`);
  });
  console.log();
} else {
  console.log('❌ FAILED - Should have rejected missing required fields\n');
}

console.log('=== Test Complete ===');
