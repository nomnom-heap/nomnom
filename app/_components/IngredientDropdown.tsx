"use client";

import { useState, useEffect } from "react";
import makeAnimated from "react-select/animated";
import dynamic from "next/dynamic";
const AsyncCreatableSelect = dynamic(
  () => import("react-select/async-creatable"),
  { ssr: false }
);
import { AsyncCreatableProps } from "react-select/async-creatable";
import { useLazyQuery } from "@apollo/client";
import { FIND_INGREDIENTS_BY_NAME_QUERY } from "../_lib/gql";

const animatedComponents = makeAnimated();

export type IngredientOption = {
  label: string;
  value: string;
};

interface IngredientGroup {
  label: string;
  options: IngredientOption[];
}

type IngredientData = {
  findIngredientsByName: Ingredient[];
};

type Props = AsyncCreatableProps<IngredientOption, boolean, IngredientGroup>;

export default (props: Props) => {
  const [findIngredientsByName] = useLazyQuery<IngredientData>(
    FIND_INGREDIENTS_BY_NAME_QUERY
  );

  const searchIngredients = async (
    inputValue: string
  ): Promise<IngredientGroup[]> => {
    if (inputValue.trim() === "") return [];

    const { data } = await findIngredientsByName({
      variables: { name: inputValue },
    });

    if (!data || !data.findIngredientsByName) {
      return [
        {
          label: "Others",
          options: [],
        },
      ];
    }
    const res: IngredientGroup[] = [];
    for (const ingredient of data.findIngredientsByName) {
      const ingredientGroup = ingredient.group ?? "Others";
      const index = res.findIndex((group) => group.label === ingredientGroup);
      if (index === -1) {
        res.push({
          label: ingredientGroup,
          options: [{ label: ingredient.name, value: ingredient.name }],
        });
      } else {
        const group = res[index];
        group.options.push({ label: ingredient.name, value: ingredient.name });
      }
    }
    return res;
  };

  const loadOptions = (inputValue: string): Promise<IngredientGroup[]> => {
    return searchIngredients(inputValue);
  };

  const formatGroupLabel = (data: IngredientGroup) => (
    <div className="flex items-center justify-between">
      <span>{data.label}</span>
      <span className="text-sm text-gray-500 inline-block rounded-3xl px-1 py-2 text-center">
        {data.options.length}
      </span>
    </div>
  );

  return (
    <div className="z-50 relative">
      {/* @ts-ignore */}
      <AsyncCreatableSelect<IngredientOption, boolean, IngredientGroup>
        {...props}
        cacheOptions
        components={animatedComponents}
        loadOptions={loadOptions}
        formatGroupLabel={formatGroupLabel}
      />
    </div>
  );
};
