import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ActorModal from "./ActorModal";

export default function SearchResults({ results, type }: any) {
  const navigate = useNavigate();
  const [selectedActor, setSelectedActor] = useState<number | null>(null);

  return (
    <>
      <ul>
        {results.map((item: any) => (
          <li
            key={item.id}
            onClick={() => {
              if (type === "person") {
                setSelectedActor(item.id);
              } else {
                navigate(`/${type}/${item.id}`);
              }
            }}
          >
            {item.title || item.name}
          </li>
        ))}
      </ul>

      {selectedActor && (
        <ActorModal
          actorId={selectedActor}
          onClose={() => setSelectedActor(null)}
        />
      )}
    </>
  );
}
