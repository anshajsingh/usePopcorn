import { useState } from "react";
import { useGeolocation } from "./useGeolocation";

//function useGeolocation() {}

export default function App() {
  //const [isLoading, setIsLoading] = useState(false);
  const [countClicks, setCountClicks] = useState(0);
  //const [position, setPosition] = useState({});
  //const [error, setError] = useState(null);
    const { isLoading, position, error } = useGeolocation({countClicks});

  const { lat, lng } = position;

  function getPosition() {
    setCountClicks((count) => count + 1);

    //const { isLoading, position, error } = useGeolocation();
  }

  return (
    <div>
      <button onClick={getPosition} disabled={isLoading}>
        Get my position
      </button>

      {isLoading && <p>Loading position...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && lat && lng && (
        <p>
          Your GPS position:{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://www.openstreetmap.org/#map=16/${lat}/${lng}`}
          >
            {lat}, {lng}
          </a>
        </p>
      )}

      <p>You requested position {countClicks} times</p>
    </div>
  );
}
