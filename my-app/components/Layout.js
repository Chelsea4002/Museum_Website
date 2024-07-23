import { Container } from "react-bootstrap";
import MainNav from "./MainNav";

export default function Layout(props) {
    return (
        <>
            <MainNav />
            <br />
            <Container className="fs-4">
                {props.children}
            </Container>
            <br />
        </>
    );
}