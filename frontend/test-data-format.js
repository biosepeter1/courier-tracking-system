// Test script to demonstrate the data format difference
// Run with: node test-data-format.js

console.log('=== Shipment Data Format Test ===\n');

// Simulated form data (as it would be in state)
const formData = {
  sender: {
    name: 'John Doe',
    phone: '+1234567890',
    address: '123 Main St',
    email: '' // Empty optional field
  },
  receiver: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+0987654321',
    address: '456 Oak Ave'
  },
  origin: 'New York, NY',
  destination: 'Los Angeles, CA',
  packageDetails: {
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    description: '',
    value: ''
  },
  estimatedDelivery: '',
  priority: 'Normal'
};

console.log('❌ OLD WAY (PROBLEMATIC):');
console.log('=====================================');
const oldWay = {
  ...formData,
  packageDetails: {
    ...formData.packageDetails,
    weight: formData.packageDetails.weight ? parseFloat(formData.packageDetails.weight) : undefined,
    value: formData.packageDetails.value ? parseFloat(formData.packageDetails.value) : undefined,
    dimensions: {
      length: formData.packageDetails.dimensions.length ? parseFloat(formData.packageDetails.dimensions.length) : undefined,
      width: formData.packageDetails.dimensions.width ? parseFloat(formData.packageDetails.dimensions.width) : undefined,
      height: formData.packageDetails.dimensions.height ? parseFloat(formData.packageDetails.dimensions.height) : undefined
    }
  }
};

console.log('What gets sent to API:');
console.log(JSON.stringify(oldWay, null, 2));
console.log('\nProblems:');
console.log('- packageDetails object exists but all fields are undefined');
console.log('- dimensions object exists but all fields are undefined');
console.log('- sender.email is empty string instead of being omitted');
console.log('- estimatedDelivery is empty string instead of being omitted\n');

console.log('✅ NEW WAY (FIXED):');
console.log('=====================================');
const shipmentData = {
  sender: {
    name: formData.sender.name,
    phone: formData.sender.phone,
    address: formData.sender.address,
    ...(formData.sender.email && { email: formData.sender.email })
  },
  receiver: {
    name: formData.receiver.name,
    email: formData.receiver.email,
    phone: formData.receiver.phone,
    address: formData.receiver.address
  },
  origin: formData.origin,
  destination: formData.destination,
  ...(formData.priority && { priority: formData.priority }),
  ...(formData.estimatedDelivery && { estimatedDelivery: formData.estimatedDelivery })
};

// Only include packageDetails if at least one field has a value
const hasPackageDetails = 
  formData.packageDetails.weight ||
  formData.packageDetails.value ||
  formData.packageDetails.description ||
  formData.packageDetails.dimensions.length ||
  formData.packageDetails.dimensions.width ||
  formData.packageDetails.dimensions.height;

if (hasPackageDetails) {
  shipmentData.packageDetails = {};
  
  if (formData.packageDetails.weight) {
    shipmentData.packageDetails.weight = parseFloat(formData.packageDetails.weight);
  }
  if (formData.packageDetails.value) {
    shipmentData.packageDetails.value = parseFloat(formData.packageDetails.value);
  }
  if (formData.packageDetails.description) {
    shipmentData.packageDetails.description = formData.packageDetails.description;
  }
  
  const hasDimensions = 
    formData.packageDetails.dimensions.length ||
    formData.packageDetails.dimensions.width ||
    formData.packageDetails.dimensions.height;
  
  if (hasDimensions) {
    shipmentData.packageDetails.dimensions = {};
    if (formData.packageDetails.dimensions.length) {
      shipmentData.packageDetails.dimensions.length = parseFloat(formData.packageDetails.dimensions.length);
    }
    if (formData.packageDetails.dimensions.width) {
      shipmentData.packageDetails.dimensions.width = parseFloat(formData.packageDetails.dimensions.width);
    }
    if (formData.packageDetails.dimensions.height) {
      shipmentData.packageDetails.dimensions.height = parseFloat(formData.packageDetails.dimensions.height);
    }
  }
}

console.log('What gets sent to API:');
console.log(JSON.stringify(shipmentData, null, 2));
console.log('\nBenefits:');
console.log('✓ packageDetails completely omitted (not present in object)');
console.log('✓ sender.email omitted (not an empty string)');
console.log('✓ estimatedDelivery omitted (not an empty string)');
console.log('✓ Only fields with actual values are included');
console.log('✓ Clean JSON that matches backend validation expectations');

console.log('\n=== Test Complete ===');
