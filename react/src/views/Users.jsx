import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/ContextProvider";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext()

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        setLoading(true);
        axiosClient
            .get("/users")
            .then(({data}) => {
                setLoading(false);
                setUsers(data.data)
            })
            .catch((error) => {
                setLoading(false);
            });
    };

    const onDelete = user => {
        if (!window.confirm('Are You sure you want to delete this user?')) {
            return
        }

        axiosClient.delete('/users/'+user.id)
            .then(() => {
                setNotification('User was deleted')
                getUsers()
            })
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">Add New</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading &&
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">Loading...</td>
                            </tr>
                        </tbody>
                    }
                    {!loading && <tbody>
                        {users.map(u => (
                            <tr>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.created_at}</td>
                                <td>
                                    <Link className="btn-edit" to={'/users/'+u.id}>Edit</Link>
                                    &nbsp;
                                    <button className="btn-delete" onClick={ev => onDelete(u)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    }
                </table>
            </div>
        </div>
    );
}
