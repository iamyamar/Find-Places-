import React from "react";
import UserList from "../components/UserList/UserList";

const User = () => {
  const USERS = [
    {
      id: "u1",
      name: "Yash",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/0/09/India_Gate_in_New_Delhi_03-2016.jpg",
      places: 4,
    },
    {
      id: "u2",
      name: "Vaibhav",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/0/09/India_Gate_in_New_Delhi_03-2016.jpg",
      places: 2,
    },
  ];

  return <UserList items={USERS} />;
};

export default User;
