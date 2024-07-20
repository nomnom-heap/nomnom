"use client";
import { OramaCloud, useSearch } from "@oramacloud/client/react";

export default function Orama() {
  return (
    <OramaCloud
      endpoint="https://cloud.orama.run/v1/indexes/recipetest-p0vetf"
      apiKey="ha1RKqwdDyFoj14NunaRoUPELKMuxPvm"
    >
      <Search />
    </OramaCloud>
  );
}

function Search() {
  const { results, error } = useSearch({
    term: "mushroom",
    limit: 5,
  });

  return (
    <>
      {results?.hits.map((hit) => (
        <div key={hit.id}>
          <p> {hit.document.myCustomProperty} </p>
        </div>
      ))}
    </>
  );
}
