import { Link } from "react-router-dom/cjs/react-router-dom.min";

import Card from "../../shared/components/UIComponents/Card";
import Avatar from "../../shared/components/UIComponents/Avatar";

import "./UserItem.css"

const UserItem = (props) => {
    return (
        <li className="user-item">
            <Card className="user-item__content">
                <Link to={`/${props.id}/places`}>
                    <div className="user-item__image">
                        <Avatar image={props.image} alt={props.name} />
                    </div>
                    <div className="user-item__info">
                        <h2>{props.name}</h2>
                        {props.numOfPlaces > 1 && <h3>see all ${props.numOfPlaces} places from ${props.name}</h3>}
                    </div>
                </Link>
            </Card>
        </li>
    )
}

export default UserItem;