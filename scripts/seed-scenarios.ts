import mongoose from 'mongoose';
import dbConnect from '../lib/dbConnect';
import Scenario from '../models/Scenario';
import User from '../models/User';
import { sampleScenarios } from '../lib/data/sample-scenarios';

async function seedScenarios() {
  try {
    // Connect to the database
    await dbConnect();
    console.log('Connected to MongoDB');

    // Find an admin user or create one if none exists
    let adminUser = await User.findOne({ email: 'admin@cybersafe.com' });
    
    if (!adminUser) {
      console.log('Creating admin user...');
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@cybersafe.com',
        password: 'admin123', // In production, use a secure password
        role: 'admin'
      });
      console.log('Admin user created');
    }

    // Clear existing scenarios
    console.log('Clearing existing scenarios...');
    await Scenario.deleteMany({});
    console.log('Existing scenarios cleared');
    
    // Add createdBy field to each scenario using the admin user's ID
    const scenariosWithCreator = sampleScenarios.map(scenario => ({
      ...scenario,
      createdBy: adminUser._id
    }));
    
    // Insert sample scenarios
    console.log('Inserting sample scenarios...');
    await Scenario.insertMany(scenariosWithCreator);
    console.log('Sample scenarios inserted successfully');

    // Log the count of inserted scenarios
    const count = await Scenario.countDocuments();
    console.log(`Total scenarios in database: ${count}`);
    
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding scenarios:', error);
    process.exit(1);
  }
}

// Run the seed function
seedScenarios();
