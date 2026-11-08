
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/contacts`;

export default function Dashboard() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase token listener
  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (user) {
        try {
          console.log("Firebase User ID:", user.uid);

          const firebaseToken = await user.getIdToken();
          setToken(firebaseToken);
        } catch (error) {
          console.error("Token error:", error);
          setToken(null);
        }
      } else {
        setToken(null);
        setContacts([]);
      }
    });

    return unsubscribe;
  }, []);

  // Copy Firebase ID Token
  const copyFirebaseToken = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      const firebaseToken = await user.getIdToken();
      await navigator.clipboard.writeText(firebaseToken);
      alert("Firebase ID Token copied!");
    } catch (error) {
      console.error("Token copy error:", error);
      alert("Unable to copy token");
    }
  };

  // Axios authentication configuration
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.get(API, config);
      setContacts(res.data);
    } catch (error) {
      console.error("Fetch contacts error:", error);

      if (error.response?.status === 401) {
        await signOut(auth);
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      fetchContacts();
    }
  }, [token, fetchContacts]);

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Add or Update Contact
  const handleSubmit = async (e) => {
    e.preventDefault();

    const contact = { name, email, phone };

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, contact, config);
      } else {
        await axios.post(API, contact, config);
      }

      setName("");
      setEmail("");
      setPhone("");
      setEditingId(null);

      await fetchContacts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save contact");
    }
  };

  // Edit Contact
  const handleEdit = (contact) => {
    setName(contact.name || "");
    setEmail(contact.email || "");
    setPhone(contact.phone || "");
    setEditingId(contact._id);
  };

  // Delete Contact
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contact?")) return;

    try {
      await axios.delete(`${API}/${id}`, config);
      await fetchContacts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete contact");
    }
  };

  // Cancel Edit
  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPhone("");
  };

  // Search
  const filteredContacts = contacts.filter((contact) =>
    `${contact.name} ${contact.email || ""} ${contact.phone || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>ContactHub</h1>
          <p>Manage your contacts in one place</p>
        </div>

        <div className="dashboard-header-actions">
          <button onClick={copyFirebaseToken}>
            Copy Firebase Token
          </button>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Add Contact Section */}
      <section className="contact-form-section">
        <h2>{editingId ? "Edit Contact" : "Add New Contact"}</h2>

        <form onSubmit={handleSubmit} className="contact-form">
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button type="submit">
            {editingId ? "Update Contact" : "Add Contact"}
          </button>

          {editingId && (
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </form>
      </section>

      {/* Contacts Section */}
      <section className="contacts-section">
        <div className="contacts-heading">
          <h2>My Contacts ({filteredContacts.length})</h2>

          <input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="empty-message">Loading contacts...</p>
        ) : (
          <>
            <div className="contacts-grid">
              {filteredContacts.map((contact) => (
                <div className="contact-card" key={contact._id}>
                  <h3>{contact.name}</h3>
                  <p>{contact.email || "No email"}</p>
                  <p>{contact.phone || "No phone"}</p>

                  <div className="contact-actions">
                    <button onClick={() => handleEdit(contact)}>
                      Edit
                    </button>

                    <button onClick={() => handleDelete(contact._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredContacts.length === 0 && (
              <p className="empty-message">No contacts found.</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
