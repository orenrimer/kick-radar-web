import UserItem from "./UserItem";
import Card from "../../shared/components/UIComponents/Card"

import "./UsersList.css"


const UsersList = (props) => {
    if (props.list.length === 0) {
        return (
            <div className="center">
                <Card><h2 >No places found.</h2></Card>
            </div>
        )
    }

    return (
        <ul className="users-list">
            {props.list.map(user => (
                <UserItem
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    image={user.image}
                    numOfPlaces={user.numOfPlaces}
                />)
            )}
        </ul>
    )
}

export default UsersList;