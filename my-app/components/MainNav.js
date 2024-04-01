import { Container, Nav, Navbar, Form, Button, NavDropdown} from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { addToHistory } from "@/lib/userData";
import { readToken, removeToken } from "@/lib/authenticate";

export default function MainNav() {
    const router = useRouter();

    const [searchField, setSearchField] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const [expanded, setExpanded] = useState(false);

    let token = readToken();

    function logout(){
        removeToken();
        router.push("/login");
    }

    const onChange = (e) => {
        setSearchField(e.target.value);
    }

    const submitForm = async (e) => {
        e.preventDefault();
        const queryString = `title=true&q=${searchField}`;
        setSearchHistory(await addToHistory(`title=true&q=${searchField}`));
        router.push(`/artwork?title=true&q=${searchField}`);
        setIsExpanded(false);
    };

    const toogleNavbar = () => {
        setIsExpanded(!isExpanded);
    }

    const handleNavLink = () => {
        setIsExpanded(false);
    }

    const handleDropdownItem = () => {
        setIsExpanded(false);
    }

    return (
        <>
            <Navbar expand="lg" className="fixed-top navbar-dark bg-primary" expanded={isExpanded}>
                <Container>
                    <Navbar.Brand>Hyerang Cho</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toogleNavbar} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link href="/" passHref legacyBehavior><Nav.Link active={router.pathname === "/"} onClick={handleNavLink}>Home</Nav.Link></Link>
                            {token && <Link href="/search" passHref legacyBehavior><Nav.Link active={router.pathname === "/search"} onClick={handleNavLink}>Advanced Search</Nav.Link></Link>}
                        </Nav>
                        &nbsp;
                        {token && <Form className="d-flex" onSubmit={submitForm}>
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                value={searchField}
                                onChange={onChange}
                            />
                            <Button variant="outline-success" type="submit">Search</Button>
                        </Form>}
                        &nbsp;
                        <Nav>
                            {token && <NavDropdown title={token.userName} id="basic-nav-dropdown">
                                <Link href="/favourites" passHref legacyBehavior>
                                    <NavDropdown.Item onClick={handleDropdownItem}>Favourites</NavDropdown.Item>
                                </Link>
                                <Link href="/history" passHref legacyBehavior>
                                    <NavDropdown.Item onClick={handleDropdownItem}>Search History</NavDropdown.Item>
                                </Link>
                                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                            </NavDropdown>}
                        </Nav>
                        {!token && <Nav className="ml-auto">
                            <Link href="/register" passHref legacyBehavior>
                                <Nav.Link active={router.pathname === "/register"} onClick={()=>setExpanded(false)}>
                                    Register
                                </Nav.Link>
                            </Link>
                            <Link href="/login" passHref legacyBehavior>
                                <Nav.Link active={router.pathname === "/login"} onClick={()=>setExpanded(false)}>
                                    Login
                                </Nav.Link>
                            </Link>
                        </Nav>}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br /><br /><br />
        </>
    );
}