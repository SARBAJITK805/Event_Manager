import { useEffect, useState, useContext } from "react";
import { fetchEvents, joinEvent, createEvent, deleteEvent } from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        name: "",
        description: "",
        date: "",
        location: "",
        category: "",
        imageUrl: ""
    });

    const { user, token } = useContext(AuthContext); // Get logged-in user details

    // Load events when component mounts
    useEffect(() => {
        const loadEvents = async () => {
            try {
                const { data } = await fetchEvents();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        loadEvents();
    }, []);

    // Handle Join Event
    const handleJoin = async (eventId) => {
        try {
            await joinEvent(eventId, token);
            alert("Joined event successfully!");
        } catch (error) {
            alert("Error joining event");
        }
    };

    // Handle Delete Event
    const handleDelete = async (eventId) => {
        try {
            await deleteEvent(eventId, token);
            setEvents(events.filter(event => event._id !== eventId)); // Remove event from UI
            alert("Event deleted successfully!");
        } catch (error) {
            alert("Error deleting event");
        }
    };

    // Handle Event Creation
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        if (!newEvent.name || !newEvent.description || !newEvent.date || !newEvent.location || !newEvent.category) {
            alert("All fields are required!");
            return;
        }

        try {
            const { data } = await createEvent(newEvent, token);
            setEvents([...events, data]); // Update event list with the new event
            setNewEvent({ name: "", description: "", date: "", location: "", category: "", imageUrl: "" }); // Clear form fields
            alert("Event created successfully!");
        } catch (error) {
            alert("Error creating event");
        }
    };

    return (
        <div>
            <h2>Event Dashboard</h2>

            {/* Create Event Form */}
            <div>
                <h3>Create a New Event</h3>
                <form onSubmit={handleCreateEvent}>
                    <input
                        type="text"
                        placeholder="Event Name"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                    />
                    <textarea
                        placeholder="Description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                    <input
                        type="datetime-local"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                    <select
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    >
                        <option value="">Select Category</option>
                        <option value="Technology">Technology</option>
                        <option value="Music">Music</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Sports">Sports</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Image URL (Optional)"
                        value={newEvent.imageUrl}
                        onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
                    />
                    <button type="submit">Create Event</button>
                </form>
            </div>

            {/* Event List */}
            <h3>Available Events</h3>
            {events.length === 0 ? (
                <p>No events available</p>
            ) : (
                events.map((event) => (
                    <div key={event._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                        {event.imageUrl && <img src={event.imageUrl} alt={event.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />}
                        <h3>{event.name}</h3>
                        <p>{event.description}</p>
                        <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Category:</strong> {event.category}</p>
                        <button onClick={() => handleJoin(event._id)}>Join Event</button>
                        
                        {/* Show delete button only for event creators */}
                        {user && user.id === event.createdBy && (
                            <button onClick={() => handleDelete(event._id)} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>
                                Delete Event
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Dashboard;
