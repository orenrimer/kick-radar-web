import EventItem from "./EventItem";
import Card from "../../shared/components/UIComponents/Card";
import CustomButton from "../../shared/components/UIComponents/CustomButton";

import "./PlacesList.css"


const PlacesList = (props) => {

    if (!props.list || props.list.length === 0) {
        return (
            <div className="place-list center">
                <Card>
                    <h2>No places found.</h2>
                </Card>
            </div>
        );
    }
    return (
        <ul className="places-list">
            {props.list.map(place => (
                <EventItem
                    key={place.id}
                    id={place.id}
                    title={place.title}
                    description={place.description}
                    images={place.image}
                    address={place.address}
                    coordinates={place.location}
                    creatorId={place.creator}
                    likes={place.likes}
                    likedBy={place.likedBy}
                    onDelete={props.onDeletePlace}
                    onLike={props.onLike}
                    showFull={props.showFull}
                />)
            )}
        </ul>
    )
}

export default PlacesList;