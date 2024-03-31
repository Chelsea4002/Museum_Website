import styles from '@/styles/History.module.css';
import { searchHistoryAtom } from "@/store";
import { useAtom } from "jotai";
import { Card, Button, ListGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function History() {
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const router = useRouter();

    let parsedHistory = [];

    searchHistory.forEach(h => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });

    const historyClicked = (e, index) => {
        router.push(`/artwork?${searchHistory[index]}`)
    }

    const removeHistoryClicked = (e, index) => {
        e.stopPropagation(); // stop the event from trigging other events
        setSearchHistory(current => {
            let x = [...current];
            x.splice(index, 1)
            return x;
        });
    }

    return (
        <>
            {
                parsedHistory.length == 0 ? (
                    <Card>
                        <Card.Body>
                            <Card.Title><h4>Nothing Here</h4></Card.Title>
                            <Card.Text>
                                Try searching for some artwork.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ) : (
                    <ListGroup>
                        {
                            parsedHistory.map((historyItem, index) => {
                                return (
                                    <ListGroup.Item className={styles.historyListItem} key={index} onClick={e => historyClicked(e, index)}>
                                        {Object.keys(historyItem).map(key => (<>{key}: <strong>{historyItem[key]}</strong>&nbsp;</>))}
                                        <Button 
                                            className="float-end" 
                                            variant="danger" 
                                            size="sm"
                                            onClick={e => removeHistoryClicked(e, index)}
                                        >
                                            &times;
                                        </Button>
                                    </ListGroup.Item>
                                );
                            })
                        }
                    </ListGroup>
                )
            }
        </>
    );
}