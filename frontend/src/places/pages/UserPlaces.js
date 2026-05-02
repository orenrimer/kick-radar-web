import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import { useHttpClient } from '../../shared/components/hooks/http-hook';
import Loading from '../../shared/components/UIComponents/Loading';
import Card from '../../shared/components/UIComponents/Card';

import PlacesList from "../components/PlacesList";


const UserPlaces = (props) => {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const { isLoading, error, sendRequest } = useHttpClient();

    // const userId = useParams().userId;
    const userId = props.userId

    const placeDeletedHandler = deletedPlaceId => {
        setLoadedPlaces(prevPlaces =>
            prevPlaces.filter(place => place.id !== deletedPlaceId)
        );
    };

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/events/user/${userId}`
                );
                setLoadedPlaces(responseData.places);
            } catch (err) { }
        };
        fetchPlaces();
    }, [sendRequest, userId]);

    return (
        <React.Fragment>
            {error && <Card className="center error"><h2>{error}</ h2></Card>}
            {isLoading && (
                <div className="center">
                    <Loading />
                </div>
            )}
            {!isLoading && loadedPlaces && <PlacesList list={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
        </React.Fragment>
    );

}

export default UserPlaces;