import { gql, useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
// import { useAuth } from "../AuthProvider";
import { fetchAuthSession } from "aws-amplify/auth";


// interface Recipe {
//   id: string;
//   name: string;
//   ingredients: string[];
//   ingredients_qty: string[];
//   serving: number;
//   time_taken_mins: number;
//   thumbnail_url: string;
//   contents: string;
//   owner: {
//     id: string;
//     display_name: string;
//   };
//   favouritedByUsers: { id: string }[];
// }

// interface User {
//   id: string;
//   display_name: string;
//   favourite_recipes: Recipe[];
// }

interface GetFavRecipesData {
  users: User[];
}

// const { userId } = useAuth();
// console.log(userId);

const GET_FAV_RECIPES_QUERY = gql`
  query getFavRecipes($userId:ID!) {
    users(where: {id_CONTAINS: $userId}){
      id
      favourite_recipes {
        id
        name
        ingredients
        ingredients_qty
        serving
        time_taken_mins
        thumbnail_url
        contents
        owner {
          id
          display_name
        }
        favouritedByUsers {
          id
        }
      }
    }
  }
`;

export default function useFavRecipes(limit: number = 9) {
  // const { userId } = useAuth();
  // console.log(userId);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [
    getFavRecipes,
    { data: getRecipesData, loading: getRecipesLoading, error: getRecipesError },
  ] = useLazyQuery<GetFavRecipesData>(GET_FAV_RECIPES_QUERY);

  useEffect(() => {
    if (getRecipesData) {
      console.log(getRecipesData)
      const allFavRecipes = getRecipesData.users.flatMap(user => user.favourite_recipes);
      const totalPages = Math.ceil(allFavRecipes.length / limit);
      setTotalPages(totalPages);
      setRecipes(prevRecipes => [...prevRecipes, ...allFavRecipes.slice((currentPage - 1) * limit, currentPage * limit)]);
    }
  }, [getRecipesData, currentPage, limit]);

  useEffect(() => {
    async function getUserId() {
      const session = await fetchAuthSession();
      const userId = session?.tokens?.accessToken.payload.sub;
      getFavRecipes({variables : {userId : userId}});
    }
    getUserId()
  }, []);

  return {
    recipes,
    totalPages,
    currentPage,
    setCurrentPage,
    loading: getRecipesLoading,
    error: getRecipesError,
  };
}


// import { gql, useLazyQuery } from "@apollo/client";
// import { useState, useEffect } from "react";

// interface GetRecipesLazyData {
//   users: User[]
//   recipes: Recipe[];
//   recipesAggregate: {
//     count: number;
//   };
// }

// const GET_RECIPES_LAZY_QUERY = gql`
//   query getFavRecipes {
//   users {
//     favourite_recipes{
//       id
//       name
//       ingredients
//       ingredients_qty
//       serving
//       time_taken_mins
//       thumbnail_url
//       contents
//       owner{
//         id
//         display_name
//       }
//       favouritedByUsers{
//         id
//       }
//     }
//   }
// }

//     recipes(
//       options: { limit: $limit, offset: $offset, sort: { updatedAt: DESC } }
//     ) {
//       id
//       name
//       contents
//       ingredients
//       ingredients_qty
//       thumbnail_url
//       time_taken_mins
//       serving
//       owner {
//         id
//         display_name
//       }
//       favouritedByUsers {
//         id
//       }
//     }
//     recipesAggregate {
//       count
//     }
// `;

// export default function useFavRecipes(limit: number = 9) {
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [totalPages, setTotalPages] = useState<number>(0);
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   const [
//     getFavRecipes,
//     {
//       data: getRecipesData,
//       loading: getRecipesLoading,
//       error: getRecipesError,
//     },
//   ] = useLazyQuery<GetRecipesLazyData>(GET_RECIPES_LAZY_QUERY);

//   useEffect(() => {
//     // console.log("getRecipesData: ", getRecipesData);
//     if (getRecipesData) {
//       const totalPages = Math.ceil(
//         getRecipesData.recipesAggregate.count / limit
//       );
//       setTotalPages(totalPages);
//       // console.log("existing recipes: ", recipes);
//       // console.log("getRecipesData.recipes", getRecipesData.recipes);
//       setRecipes([...recipes, ...getRecipesData.users.favourite_recipes]);
//     }
//   }, [getRecipesData]);

//   useEffect(() => {
//     getFavRecipes({
//       variables: { limit: limit, offset: (currentPage - 1) * limit },
//     });
//   }, [currentPage]);

//   return {
//     recipes,
//     totalPages,
//     currentPage,
//     setCurrentPage,
//   };
// }
