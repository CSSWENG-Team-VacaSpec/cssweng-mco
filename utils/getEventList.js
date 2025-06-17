// const Event = require('../models/events'); // Import your Event model

// exports.getEvents = async (req, res) => {
//     try {
//         const events = await Event.find(); // Fetch all events
//         res.status(200).json(events); // Send JSON response
//     } catch (error) {
//         console.error("Error fetching events:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };