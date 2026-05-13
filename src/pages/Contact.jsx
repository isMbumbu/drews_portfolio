import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import '../components/contact.css';

function Contact() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    
    const response = await fetch("https://formspree.io/f/mdabjvkk", {
      method: "POST",
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      setStatus("SUCCESS");
      form.reset();
    } else {
      setStatus("ERROR");
    }
  };

  return (
    <main className="cnt-root">
      <Navigation />
      
      <aside className="cnt-rail">
        <span className="cnt-rail-text">ESTABLISH CONNECTION — 2026</span>
      </aside>

      <section className="cnt-container">
        <header className="cnt-header">
          <span className="cnt-meta">CONTACT</span>
          <h1 className="cnt-main-title">Start a <em>Conversation</em></h1>
        </header>

        <div className="cnt-content-grid">
          <div className="cnt-instruction">
            <p className="cnt-lead">
              Have a project in mind or a technical challenge you’re looking to solve?
            </p>
            <p className="cnt-subtext">
              Fill out the form, and I’ll get back to you within 24 hours. 
              Let's turn your vision into scalable architecture.
            </p>
          </div>

          <motion.form 
            onSubmit={handleSubmit}
            className="cnt-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Formspree uses the "name" attributes to label the data in your email */}
            <div className="form-group">
              <label>FULL NAME</label>
              <input type="text" name="name" placeholder="John Doe" required />
            </div>

            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <input type="email" name="_replyto" placeholder="john@example.com" required />
            </div>

            <div className="form-group">
              <label>MESSAGE</label>
              <textarea name="message" rows="5" placeholder="Tell me about your project..." required></textarea>
            </div>

            <button type="submit" className="cnt-submit-btn">
              {status === "SUCCESS" ? "MESSAGE SENT" : "SEND INQUIRY ↗"}
            </button>
            
            {status === "ERROR" && <p className="error-msg">Something went wrong. Please try again.</p>}
            {status === "SUCCESS" && <p className="success-msg">Thanks! I'll be in touch soon.</p>}
          </motion.form>
        </div>
      </section>
    </main>
  );
}

export default Contact;