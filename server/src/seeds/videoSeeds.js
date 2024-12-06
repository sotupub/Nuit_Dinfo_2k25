const mongoose = require('mongoose');
const Video = require('../models/Video');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function seedVideos() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/ocean_conservation', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Clear existing data
        await Video.deleteMany({});

        // Create a test user if none exists
        let testUser = await User.findOne({ email: 'test@example.com' });
        if (!testUser) {
            testUser = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: await bcrypt.hash('password123', 10)
            });
        }

        // Sample video data
        const videos = [
            {
                title: 'Ocean Plastic Crisis: Understanding the Impact',
                description: 'An in-depth look at how plastic pollution affects marine ecosystems and what we can do to help.',
                thumbnail: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef',
                duration: '12:45',
                category: 'Environment',
                url: 'https://www.youtube.com/watch?v=HQTUWK7CM-Y',
                views: 1200,
                likes: 345,
                userId: testUser._id
            },
            {
                title: 'Coral Reef Restoration Projects',
                description: 'Discover how marine biologists are working to restore damaged coral reefs around the world.',
                thumbnail: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b',
                duration: '15:30',
                category: 'Conservation',
                url: 'https://www.youtube.com/watch?v=0CYfo6QtxNg',
                views: 890,
                likes: 267,
                userId: testUser._id
            },
            {
                title: 'Marine Life in the Deep Ocean',
                description: 'Explore the fascinating creatures that live in the deepest parts of our oceans.',
                thumbnail: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd',
                duration: '18:15',
                category: 'Wildlife',
                url: 'https://www.youtube.com/watch?v=6vK8scnv8zs',
                views: 1500,
                likes: 423,
                userId: testUser._id
            },
            {
                title: 'Sustainable Fishing Practices',
                description: 'Learn about sustainable fishing methods that help preserve marine ecosystems.',
                thumbnail: 'https://images.unsplash.com/photo-1534073737927-85f1ebff1f5d',
                duration: '10:20',
                category: 'Education',
                url: 'https://www.youtube.com/watch?v=YQZxVSPAP8U',
                views: 678,
                likes: 189,
                userId: testUser._id
            },
            {
                title: 'Climate Change and Ocean Acidification',
                description: 'Understanding how climate change affects ocean chemistry and marine life.',
                thumbnail: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f',
                duration: '20:00',
                category: 'Environment',
                url: 'https://www.youtube.com/watch?v=GL7qJYKzcsk',
                views: 2100,
                likes: 567,
                userId: testUser._id
            },
            {
                title: 'Whale Migration Patterns',
                description: 'Follow the incredible journey of whales as they migrate across the world\'s oceans.',
                thumbnail: 'https://images.unsplash.com/photo-1511715282680-fbf93a50e721',
                duration: '16:40',
                category: 'Wildlife',
                url: 'https://www.youtube.com/watch?v=q6ZgYGBdMzY',
                views: 1345,
                likes: 398,
                userId: testUser._id
            }
        ];

        // Insert videos
        await Video.insertMany(videos);

        console.log('✅ Videos seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding videos:', error);
        process.exit(1);
    }
}

// Run the seed function
seedVideos();
