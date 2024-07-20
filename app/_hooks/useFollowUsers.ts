import { gql, useMutation } from "@apollo/client";

const FOLLOW_USER_MUTATION = gql`
  mutation FollowUser($userId: ID!, $userToFollowId: ID!) {
    updateUsers(
      where: { id: $userId }
      connect: { following: { where: { node: { id: $userToFollowId } } } }
    ) {
      info {
        relationshipsCreated
      }
    }
  }
`;

interface FollowUserMutationData {
  updateUsers: {
    info: {
      relationshipsCreated: number;
    };
  };
}

const UNFOLLOW_USER_MUTATION = gql`
  mutation UnfollowUser($userId: ID!, $userToUnfollowId: ID!) {
    updateUsers(
      where: { id: $userId }
      disconnect: { following: { where: { node: { id: $userToUnfollowId } } } }
    ) {
      info {
        relationshipsDeleted
      }
    }
  }
`;

interface UnfollowUserMutationData {
  updateUsers: {
    info: {
      relationshipsDeleted: number;
    };
  };
}

export default function useFollowUsers() {
  const [
    followUser,
    {
      loading: followUserLoading,
      error: followUserError,
      data: followUserData,
    },
  ] = useMutation<FollowUserMutationData>(FOLLOW_USER_MUTATION);

  const [
    unfollowUser,
    {
      loading: unfollowUserLoading,
      error: unfollowUserError,
      data: unfollowUserData,
    },
  ] = useMutation<UnfollowUserMutationData>(UNFOLLOW_USER_MUTATION);

  return {
    followUser,
    followUserLoading,
    followUserError,
    followUserData,
    unfollowUser,
    unfollowUserLoading,
    unfollowUserError,
    unfollowUserData,
  };
}
