const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Movie = require('../models/Movie');
const { mongoUri } = require('../config/env');

const seedMovies = [
  {
    title: 'The Digital Frontier',
    description: 'In a world where virtual reality has replaced the physical, one hacker discovers the truth behind the simulation.',
    releaseYear: 2024,
    genres: ['Sci-Fi', 'Thriller'],
    duration: 148,
    posterUrl: 'https://via.placeholder.com/300x450/1a1a2e/e74c3c?text=Digital+Frontier',
    backdropUrl: 'https://via.placeholder.com/1920x1080/1a1a2e/e74c3c?text=The+Digital+Frontier',
    rating: 8.5,
    maturityRating: 'TV-MA',
    isMovie: true,
    featured: true,
  },
  {
    title: 'Midnight in Paris',
    description: 'A romantic comedy about a writer who discovers he can travel back in time to the 1920s Paris art scene.',
    releaseYear: 2023,
    genres: ['Romance', 'Comedy', 'Fantasy'],
    duration: 124,
    posterUrl: 'https://via.placeholder.com/300x450/2d1a1a/e7c43c?text=Midnight+Paris',
    backdropUrl: 'https://via.placeholder.com/1920x1080/2d1a1a/e7c43c?text=Midnight+in+Paris',
    rating: 7.8,
    maturityRating: 'PG-13',
    isMovie: true,
  },
  {
    title: 'Shadow Protocol',
    description: 'An elite spy must stop a global cyberattack while uncovering a conspiracy within her own agency.',
    releaseYear: 2024,
    genres: ['Action', 'Thriller', 'Espionage'],
    duration: 136,
    posterUrl: 'https://via.placeholder.com/300x450/1a2d1a/3ce7c4?text=Shadow+Protocol',
    backdropUrl: 'https://via.placeholder.com/1920x1080/1a2d1a/3ce7c4?text=Shadow+Protocol',
    rating: 7.2,
    maturityRating: 'R',
    isMovie: true,
  },
  {
    title: 'Echoes of Tomorrow',
    description: 'A family drama spanning three generations, exploring love, loss, and the ties that bind us across time.',
    releaseYear: 2023,
    genres: ['Drama', 'Family'],
    duration: 152,
    posterUrl: 'https://via.placeholder.com/300x450/2d2d1a/c43ce7?text=Echoes+Tomorrow',
    backdropUrl: 'https://via.placeholder.com/1920x1080/2d2d1a/c43ce7?text=Echoes+of+Tomorrow',
    rating: 8.1,
    maturityRating: 'PG',
    isMovie: true,
  },
  {
    title: 'Neon Nights',
    description: 'A cyberpunk noir detective story set in a rain-soaked megacity of the future.',
    releaseYear: 2024,
    genres: ['Sci-Fi', 'Noir', 'Mystery'],
    duration: 140,
    posterUrl: 'https://via.placeholder.com/300x450/1a1a2d/e7c43c?text=Neon+Nights',
    backdropUrl: 'https://via.placeholder.com/1920x1080/1a1a2d/e7c43c?text=Neon+Nights',
    rating: 8.3,
    maturityRating: 'TV-MA',
    isMovie: true,
    featured: true,
  },
  {
    title: 'The Last Kingdom',
    description: 'A historical epic following a warrior\'s journey through medieval kingdoms in a quest for justice.',
    releaseYear: 2022,
    genres: ['Action', 'History', 'Drama'],
    duration: 158,
    posterUrl: 'https://via.placeholder.com/300x450/2d1a2d/3c7ec4?text=Last+Kingdom',
    backdropUrl: 'https://via.placeholder.com/1920x1080/2d1a2d/3c7ec4?text=The+Last+Kingdom',
    rating: 8.7,
    maturityRating: 'TV-MA',
    isMovie: false,
    featured: true,
  },
  {
    title: 'Laugh Lab',
    description: 'A comedy series following a group of misfit scientists who discover the formula for the perfect joke.',
    releaseYear: 2024,
    genres: ['Comedy', 'Science'],
    duration: 30,
    posterUrl: 'https://via.placeholder.com/300x450/1a2d2d/e7e73c?text=Laugh+Lab',
    backdropUrl: 'https://via.placeholder.com/1920x1080/1a2d2d/e7e73c?text=Laugh+Lab',
    rating: 7.5,
    maturityRating: 'TV-14',
    isMovie: false,
  },
  {
    title: 'Deep Space Nine',
    description: 'A crew of explorers aboard a generation ship must navigate the challenges of a centuries-long journey to a new star system.',
    releaseYear: 2023,
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    duration: 60,
    posterUrl: 'https://via.placeholder.com/300x450/1a1a1a/e7e7e7?text=Deep+Space+9',
    backdropUrl: 'https://via.placeholder.com/1920x1080/1a1a1a/e7e7e7?text=Deep+Space+Nine',
    rating: 9.1,
    maturityRating: 'TV-MA',
    isMovie: false,
    featured: true,
  },
  {
    title: 'Culinary Quest',
    description: 'A reality competition where chefs travel the world to master the most challenging dishes from every culture.',
    releaseYear: 2024,
    genres: ['Reality', 'Cooking', 'Travel'],
    duration: 45,
    posterUrl: 'https://via.placeholder.com/300x450/2d2d2d/e74c3c?text=Culinary+Quest',
    backdropUrl: 'https://via.placeholder.com/1920x1080/2d2d2d/e74c3c?text=Culinary+Quest',
    rating: 7.9,
    maturityRating: 'TV-G',
    isMovie: false,
  },
  {
    title: 'The Whispering Pines',
    description: 'A horror series set in a small town where the forest whispers secrets that drive people mad.',
    releaseYear: 2024,
    genres: ['Horror', 'Mystery', 'Supernatural'],
    duration: 50,
    posterUrl: 'https://via.placeholder.com/300x450/0a0a0a/4c3ce7?text=Whispering+Pines',
    backdropUrl: 'https://via.placeholder.com/1920x1080/0a0a0a/4c3ce7?text=The+Whispering+Pines',
    rating: 8.4,
    maturityRating: 'TV-MA',
    isMovie: false,
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('Clearing existing data...');
    await Movie.deleteMany({});
    await User.deleteMany({});

    console.log('Seeding movies...');
    await Movie.insertMany(seedMovies);

    console.log('Creating admin user...');
    await User.create({
      name: 'Admin',
      email: 'admin@streamvault.com',
      password: 'admin123',
      isAdmin: true,
    });

    console.log('Creating demo user...');
    await User.create({
      name: 'Demo User',
      email: 'demo@streamvault.com',
      password: 'demo123',
    });

    console.log('Seed completed successfully!');
    console.log('Admin: admin@streamvault.com / admin123');
    console.log('Demo: demo@streamvault.com / demo123');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();
