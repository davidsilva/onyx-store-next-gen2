"use client";

import { fetchUserAttributes } from "aws-amplify/auth";
import { useEffect, useState } from "react";

const UserProfile = () => {
  useEffect(() => {
    const fetchUserAttrs = async () => {
      const result = await fetchUserAttributes();
      console.log("fetchUserAttributes", result);
    };

    fetchUserAttrs();
  }, []);

  return <div>UserProfile</div>;
};
export default UserProfile;
