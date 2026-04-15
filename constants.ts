import { DatasetTopic } from './types';

export const DATASETS: DatasetTopic[] = [
    {
        id: 'mixed',
        name: 'General Mix (Default)',
        description: 'A diverse mix of technology, space, health, and animal facts.',
        sentences: [
            { text: "The quick brown fox jumps over the lazy dog.", category: "animals" },
            { text: "Artificial intelligence is transforming the tech industry.", category: "tech" },
            { text: "Space exploration has reached new heights this decade.", category: "space" },
            { text: "A healthy diet consists of fruits, vegetables, and whole grains.", category: "health" },
            { text: "Machine learning models require large amounts of data.", category: "tech" },
            { text: "The James Webb telescope captured stunning images of galaxies.", category: "space" },
            { text: "Regular exercise improves cardiovascular health.", category: "health" },
            { text: "Quantum computing could solve complex problems in seconds.", category: "tech" },
            { text: "Cats are known for their agility and independent nature.", category: "animals" },
            { text: "Renewable energy sources are crucial for a sustainable future.", category: "environment" }
        ]
    },
    {
        id: 'space',
        name: 'Space & Astronomy',
        description: 'Sentences focused on planets, stars, and the universe.',
        sentences: [
            { text: "Mars is often called the Red Planet due to its iron oxide surface.", category: "planets" },
            { text: "Black holes have gravitational pulls so strong that not even light can escape.", category: "physics" },
            { text: "The Milky Way galaxy contains billions of stars and planetary systems.", category: "galaxies" },
            { text: "Astronauts experience microgravity when orbiting the Earth.", category: "exploration" },
            { text: "Saturn's rings are made mostly of ice particles and rocky debris.", category: "planets" },
            { text: "A supernova is a powerful and luminous stellar explosion.", category: "stars" },
            { text: "The Apollo 11 mission successfully landed humans on the Moon in 1969.", category: "history" },
            { text: "Exoplanets are planets that orbit stars outside our solar system.", category: "planets" },
            { text: "Dark matter makes up about 85% of the matter in the universe.", category: "physics" },
            { text: "Radio telescopes detect radio waves emitted by astronomical objects.", category: "technology" }
        ]
    },
    {
        id: 'tech',
        name: 'Technology & Computing',
        description: 'Topics covering software, hardware, and digital trends.',
        sentences: [
            { text: "Cloud computing allows users to access servers and storage over the internet.", category: "infrastructure" },
            { text: "Cybersecurity protects computer systems and networks from digital attacks.", category: "security" },
            { text: "Blockchain is a decentralized, distributed, and public digital ledger.", category: "software" },
            { text: "Virtual reality immerses users in a fully simulated 3D environment.", category: "hardware" },
            { text: "Python and JavaScript are popular high-level programming languages.", category: "software" },
            { text: "Solid-state drives (SSDs) are faster and more reliable than traditional hard drives.", category: "hardware" },
            { text: "The Internet of Things connects everyday devices to the web for data sharing.", category: "infrastructure" },
            { text: "Open-source software allows anyone to inspect, modify, and enhance the code.", category: "software" },
            { text: "5G networks provide faster data speeds and lower latency for mobile devices.", category: "infrastructure" },
            { text: "Deep learning is a subset of machine learning based on artificial neural networks.", category: "ai" }
        ]
    },
    {
        id: 'nature',
        name: 'Nature & Environment',
        description: 'Ecosystems, wildlife, and climate-related sentences.',
        sentences: [
            { text: "The Amazon rainforest is known for its immense biodiversity.", category: "ecosystems" },
            { text: "Coral reefs support a quarter of all marine species on the planet.", category: "oceans" },
            { text: "Climate change is causing global temperatures and sea levels to rise.", category: "climate" },
            { text: "Photosynthesis is the process by which plants convert sunlight into energy.", category: "biology" },
            { text: "Bees play a critical role in pollinating flowering plants and crops.", category: "animals" },
            { text: "Deforestation contributes significantly to habitat loss and carbon emissions.", category: "climate" },
            { text: "The Mariana Trench is the deepest oceanic trench on Earth.", category: "oceans" },
            { text: "Migratory birds travel thousands of miles each year to breed and feed.", category: "animals" },
            { text: "Renewable resources like wind and solar power help reduce pollution.", category: "climate" },
            { text: "Fungi are essential for decomposing organic matter in forest ecosystems.", category: "biology" }
        ]
    },
    {
        id: 'history',
        name: 'History & Culture',
        description: 'Historical events, ancient civilizations, and human progress.',
        sentences: [
            { text: "The Roman Empire was one of the largest and most influential in history.", category: "ancient" },
            { text: "The Great Pyramid of Giza was built as a tomb for the pharaoh Khufu.", category: "ancient" },
            { text: "The Renaissance was a period of cultural, artistic, and scientific rebirth.", category: "eras" },
            { text: "The Industrial Revolution transitioned societies from agrarian to manufacturing.", category: "eras" },
            { text: "World War II was a global conflict that lasted from 1939 to 1945.", category: "conflicts" },
            { text: "The printing press revolutionized the production and distribution of books.", category: "inventions" },
            { text: "Ancient Greece is widely considered the cradle of Western civilization.", category: "ancient" },
            { text: "The Silk Road was a network of trade routes connecting the East and West.", category: "trade" },
            { text: "Feudalism was the dominant social system in medieval Europe.", category: "eras" },
            { text: "The discovery of penicillin by Alexander Fleming transformed modern medicine.", category: "inventions" }
        ]
    }
];

export const VECTOR_DIMENSIONS = 32; // Kept for Tab 3 mock visualization
