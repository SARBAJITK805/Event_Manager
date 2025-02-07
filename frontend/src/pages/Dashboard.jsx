import { useEffect, useState, useContext } from "react";
import { fetchEvents, joinEvent, createEvent, deleteEvent, updateEvent } from "../services/api.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null); 
    const [updatedEvent, setUpdatedEvent] = useState({});
    const [newEvent, setNewEvent] = useState({
        name: "",
        description: "",
        date: "",
        location: "",
        category: "",
        imageUrl: "",
    });

    const { user, token } = useContext(AuthContext);

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
    }, [events]);

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
            setEvents(events.filter(event => event._id !== eventId));
            alert("Event deleted successfully!");
        } catch (error) {
            alert("Error deleting event");
        }
    };

    // Handle Create Event
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        if (!newEvent.name || !newEvent.description || !newEvent.date || !newEvent.location || !newEvent.category) {
            alert("All fields are required!");
            return;
        }
        try {
            const { data } = await createEvent(newEvent, token);
            setEvents([...events, data]);
            setNewEvent({ name: "", description: "", date: "", location: "", category: "", imageUrl: "" });
            alert("Event created successfully!");
        } catch (error) {
            alert("Error creating event");
        }
    };

    // Handle Edit Event - Open Edit Form
    const handleEdit = (event) => {
        setEditingEvent(event);
        setUpdatedEvent({ ...event }); // Fill form with current event details
    };

    // Handle Update Event
    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            const { data } = await updateEvent(editingEvent._id, updatedEvent, token);
            setEvents(events.map(event => (event._id === editingEvent._id ? data : event)));
            setEditingEvent(null); // Close edit form
            alert("Event updated successfully!");
        } catch (error) {
            alert("Error updating event");
        }
    };

    return (
        <div>
            <h2>Event Dashboard</h2>

            {/* Create Event Form */}
            <div>
                <h3>Create a New Event</h3>
                <form onSubmit={handleCreateEvent}>
                    <input type="text" placeholder="Event Name" value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} />
                    <textarea placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
                    <input type="datetime-local" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                    <input type="text" placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
                    <select value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}>
                        <option value="">Select Category</option>
                        <option value="Technology">Technology</option>
                        <option value="Music">Music</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Sports">Sports</option>
                    </select>
                    <input type="text" placeholder="Image URL (Optional)" value={newEvent.imageUrl} onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })} />
                    <button type="submit">Create Event</button>
                </form>
            </div>

            {/* Event List */}
            <h3>Available Events</h3>
            {events.length === 0 ? <p>No events available</p> : (
                events.map((event) => (
                    <div key={event._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                        {event.imageUrl && <img src={event.imageUrl} alt={event.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />}
                        <h3>{event.name}</h3>
                        <p>{event.description}</p>
                        <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Category:</strong> {event.category}</p>
                        <button onClick={() => handleJoin(event._id)}>Join Event</button>

                        {/* Edit & Delete Buttons (Only for Creator) */}
                        {user && event.createdBy && user.id === event.createdBy._id && (
                            <>
                                <button onClick={() => handleEdit(event)} style={{ marginLeft: "10px", backgroundColor: "blue", color: "white" }}>
                                    Edit Event
                                </button>
                                <button onClick={() => handleDelete(event._id)} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>
                                    Delete Event
                                </button>
                            </>
                        )}
                    </div>
                ))
            )}

            {/* Edit Event Form */}
            {editingEvent && (
                <div style={{ border: "1px solid #ccc", padding: "15px", marginTop: "20px" }}>
                    <h3>Edit Event</h3>
                    <form onSubmit={handleUpdateEvent}>
                        <input type="text" value={updatedEvent.name} onChange={(e) => setUpdatedEvent({ ...updatedEvent, name: e.target.value })} />
                        <textarea value={updatedEvent.description} onChange={(e) => setUpdatedEvent({ ...updatedEvent, description: e.target.value })} />
                        <input type="datetime-local" value={updatedEvent.date ? new Date(updatedEvent.date).toISOString().slice(0, 16) : ""} onChange={(e) => setUpdatedEvent({ ...updatedEvent, date: e.target.value })} />
                        <input type="text" value={updatedEvent.location} onChange={(e) => setUpdatedEvent({ ...updatedEvent, location: e.target.value })} />
                        <select value={updatedEvent.category} onChange={(e) => setUpdatedEvent({ ...updatedEvent, category: e.target.value })}>
                            <option value="Technology">Technology</option>
                            <option value="Music">Music</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Sports">Sports</option>
                        </select>
                        <input type="text" value={updatedEvent.imageUrl} onChange={(e) => setUpdatedEvent({ ...updatedEvent, imageUrl: e.target.value })} />
                        <button type="submit">Update Event</button>
                        <button type="button" onClick={() => setEditingEvent(null)} style={{ marginLeft: "10px", backgroundColor: "gray", color: "white" }}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
