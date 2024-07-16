import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { fetchAuthSession } from "aws-amplify/auth";
import { useState, useEffect, useRef } from "react";

// interface GetPeopleYouFollow {
//   id: String;
// }

const GET_FOLLOWING_QUERY = gql`
  query MyQuery($userId: ID!) {
    users(where: { id: $userId }) {
      following {
        id
      }
    }
  }
`;

async function getUserId() {
  const session = await fetchAuthSession();
  const userId = session?.tokens?.accessToken.payload.sub;
}

export default function useGetPeopleYouFollowQuery() {
  useRef;
  const [peopleYouFollow, setPeopleYouFollow] = useState("");

  const {
    data: getFollowingData,
    loading: getFollowingLoading,
    error: getFollowingError,
  } = useQuery(GET_FOLLOWING_QUERY, {
    variables: { userId },
  });

  useEffect(() => {
    if (getFollowingError) {
      console.error("getFollowingDataError: ", getFollowingError);
    }

    if (getFollowingData) {
      setPeopleYouFollow(getFollowingData);
    }
  }, [getFollowingError, getFollowingData]);

  return peopleYouFollow;
}
