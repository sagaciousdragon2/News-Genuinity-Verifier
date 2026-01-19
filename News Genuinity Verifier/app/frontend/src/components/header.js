import { React } from "react";

import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Search } from 'react-bootstrap-icons';

function Header(props) {

    const { activeContainer } = props;

    return (
        <header>
            <Container>
                <Navbar expand="lg" className="header-navbar">
                    <Container className="header-container d-flex justify-content-between align-items-center position-relative py-3">
                        <div className="header-left d-none d-lg-block" style={{ width: '200px' }}></div>

                        <div className="header-center position-absolute start-50 translate-middle-x">
                            <LinkContainer to='/'>
                                <Navbar.Brand href="/" className="m-0 p-0 text-center">
                                    <div className="brand-wrapper d-flex flex-column align-items-center gap-2">
                                        <img src={process.env.PUBLIC_URL + '/logo.png'} height={60} className='logo-image-premium' alt="Logo"></img>
                                        <span className="brand-text-premium fs-4">Genuinity <span className="brand-accent-premium">Verifier</span></span>
                                    </div>
                                </Navbar.Brand>
                            </LinkContainer>
                        </div>

                        <div className="header-right">
                            <Navbar.Toggle aria-controls="hearder-navbar" className="border-0 shadow-none" />
                            <Navbar.Collapse id="hearder-navbar">
                                <Nav className="align-items-center nav-glass-list">
                                    <LinkContainer to='/checkbytitle'>
                                        <Nav.Link className={activeContainer === 2 ? 'active-link mx-2 d-flex align-items-center' : 'inactive-link mx-2 d-flex align-items-center'}>
                                            <Search className="me-2" /> Search and Verify
                                        </Nav.Link>
                                    </LinkContainer>
                                </Nav>
                            </Navbar.Collapse>
                        </div>
                    </Container>
                </Navbar>
            </Container>
        </header>
    )
};

export default Header;