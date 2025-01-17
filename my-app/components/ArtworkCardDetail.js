import useSWR from "swr";
import Error from "next/error";
import { Button, Card } from 'react-bootstrap';
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { useEffect, useState } from "react";

import { addToFavourites, removeFromFavourites } from '@/lib/userData';

export default function ArtworkCardDetail({objectID}) {
    const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null);
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(false);

    useEffect(()=>{
        setShowAdded(favouritesList?.includes(objectID))
    }, [favouritesList])

    const favouritesClicked = async () => {
        if (showAdded) {
            setFavouritesList(await removeFromFavourites(objectID)); 
            setShowAdded(false);
        } else {
            setFavouritesList(await addToFavourites(objectID));
            setShowAdded(true);
        }
    }

    if (error) {
        return <Error statusCode={404} />
    }

    if (data) {
        return (
            <Card>
                {data.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
                <Card.Body>
                    <Card.Title>{data.title || "N/A"}</Card.Title>
                    <Card.Text>
                        <strong>Date:</strong> {data.objectDate || "N/A"}<br />
                        <strong>Calssification: </strong> {data.classification || "N/A"}<br />
                        <strong>Medium: </strong> {data.medium || "N/A"}
                        <br /><br />
                        <strong>Artist: </strong> {data.artistDisplayName || "N/A"}
                            {data.artistWikidata_URL && <>{' '}( <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer" >wiki</a> )</>}<br />
                        <strong>Credit Line: </strong> {data.creditLine || "N/A"}<br />
                        <strong>Dimensions: </strong> {data.dimensions || "N/A"}<br /><br />
                        <Button variant={showAdded ? "primary" : "outline-primary"} className="fs-4" onClick={favouritesClicked}>
                            {showAdded ? "+ Favourite (added)" : "+ Favourite"}
                        </Button>
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    } else {
        return null;
    }
}