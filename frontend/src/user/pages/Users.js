import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import Card from "../../shared/components/UIComponents/Card";
import { useHttpClient } from '../../shared/components/hooks/http-hook';
import Loading from "../../shared/components/UIComponents/Loading";

import "./Users.css"

const User = () => {
    const { isLoading, error, sendRequest } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(
                    '/users'
                );
                console.log(responseData.users)
                setLoadedUsers(responseData.users);
            } catch (err) { }
        };
        fetchUsers();
    }, [sendRequest]);

    return (
        <React.Fragment>
            {error && <Card className="center error"><h2>{error}</ h2></Card>}
            {isLoading && (
                <div className="center">
                    <Loading />
                </div>
            )}
            {!isLoading && loadedUsers && <UsersList list={loadedUsers} />}
        </React.Fragment>
    );

}

export default User;