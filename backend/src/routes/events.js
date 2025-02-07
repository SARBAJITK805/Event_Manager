const express = require("express");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Create Event
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { name, description, date, location, category, imageUrl } = req.body;
        if (!name || !description || !date || !location || !category) {
            return res.status(400).json({ message: "All fields except image are required!" });
        }

        const event = new Event({
            name,
            description,
            date,
            location,
            category,
            imageUrl,
            createdBy: req.user.id
        });

        await event.save();
        return res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Get Events
router.get("/", async (req, res) => {
    try {
        const events = await Event.find().populate("createdBy", "name");
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Join Event
router.post("/join/:eventId", authMiddleware, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (!event.attendees.includes(req.user.id)) {
            event.attendees.push(req.user.id);
            await event.save();
        }

        res.json(event);
    } catch (error) {
        console.log("problem in Join Event");        
        console.log(error)
        res.status(500).json({ message: "Server error" });
    }
});

// Delete Event
router.delete("/:eventId", authMiddleware, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await event.deleteOne();
        res.json({ message: "Event deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update Event

router.put("/:eventId", authMiddleware, async (req, res) => {
    try {
        const { name, description, date, location, category, imageUrl } = req.body;
        let event = await Event.findById(req.params.eventId);

        if (!event) return res.status(404).json({ message: "Event not found" });

        // Check if the user is the event creator
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Update event fields
        event.name = name || event.name;
        event.description = description || event.description;
        event.date = date || event.date;
        event.location = location || event.location;
        event.category = category || event.category;
        event.imageUrl = imageUrl || event.imageUrl;

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



module.exports = router;
