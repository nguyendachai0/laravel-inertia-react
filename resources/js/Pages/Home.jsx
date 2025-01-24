import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGift, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const Home = () => {
    const [showSurprise, setShowSurprise] = useState(false);
    const [currentQuote, setCurrentQuote] = useState("");

    const motivationalQuotes = [
        "The only way to do great work is to love what you do!",
        "Believe you can and you're halfway there!",
        "Success is not final, failure is not fatal: it is the courage to continue that counts!",
        "The future belongs to those who believe in the beauty of their dreams!",
        "Don't watch the clock; do what it does. Keep going!"
    ];

    const surpriseImages = [
        "https://images.unsplash.com/photo-1513151233558-d860c5398176",
        "https://images.unsplash.com/photo-1513885535751-8b9238bd345a",
        "https://images.unsplash.com/photo-1486812836605-9fec33b14796"
    ];

    const handleSurpriseClick = () => {
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        setCurrentQuote(randomQuote);
        setShowSurprise(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8">
            <div className="max-w-4xl mx-auto">
                <motion.h1
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl font-bold text-white text-center mb-12"
                >
                    Surprise! 🎉
                </motion.h1>

                <div className="text-center">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-white text-purple-600 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center mx-auto text-xl"
                        onClick={handleSurpriseClick}
                    >
                        <FaGift className="mr-2" />
                        Click Me for a Surprise!
                    </motion.button>

                    {showSurprise && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mt-12"
                        >
                            <div className="bg-white rounded-lg p-8 shadow-2xl">
                                <div className="mb-8">
                                    <FaQuoteLeft className="text-purple-500 text-2xl inline" />
                                    <p className="text-gray-800 text-2xl font-medium mx-4 inline">
                                        {currentQuote}
                                    </p>
                                    <FaQuoteRight className="text-purple-500 text-2xl inline" />
                                </div>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                    {surpriseImages.map((image, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            className="overflow-hidden rounded-lg shadow-lg"
                                        >
                                            <img
                                                src={image}
                                                alt={`Surprise ${index + 1}`}
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176";
                                                }}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;