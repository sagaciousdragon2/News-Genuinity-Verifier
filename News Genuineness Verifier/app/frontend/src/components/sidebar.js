import React from 'react';
import { useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {
    Clock,
    Globe,
    Megaphone,
    Briefcase,
    Bank,
    Cpu
} from 'react-bootstrap-icons';

function Sidebar() {
    const location = useLocation();
    const categories = [
        { name: 'News', path: '/category/news', icon: <Clock /> },
        { name: 'World', path: '/category/world', icon: <Globe /> },
        { name: 'Sport', path: '/category/sport', icon: <Megaphone /> },
        { name: 'Business', path: '/category/business', icon: <Briefcase /> },
        { name: 'Politics', path: '/category/politics', icon: <Bank /> },
        { name: 'Technology', path: '/category/technology', icon: <Cpu /> },
    ];

    return (
        <aside className="app-sidebar shadow-lg">
            <div className="sidebar-content">
                <div className="sidebar-section-label">Categories</div>
                <Nav className="flex-column sidebar-nav mt-3">
                    {categories.map((cat, index) => (
                        <LinkContainer to={cat.path} key={index}>
                            <Nav.Link className={`sidebar-link d-flex align-items-center gap-3 ${location.pathname === cat.path ? 'active-link' : ''}`}>
                                <span className="sidebar-icon">{cat.icon}</span>
                                <span className="sidebar-text">{cat.name}</span>
                            </Nav.Link>
                        </LinkContainer>
                    ))}
                </Nav>
            </div>
        </aside>
    );
}

export default Sidebar;
