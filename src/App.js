import React, { useState, useEffect } from "react";

export default function App() {
  const [repositories, setRepositories] = useState([]);
  const [location, setLocation] = useState({});

  useEffect(async () => {
    const watchId = navigator.geolocation.watchPosition(handlePositionReceived);

    const data = await fetchRepositories("lhendinha");

    setRepositories(data);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const filtered = repositories.filter(repo => repo.favorite);

    document.title = `You have ${filtered.length} favorites repositories.`;
  }, [repositories]);

  async function fetchRepositories(repositorieName) {
    const response = await fetch(
      `https://api.github.com/users/${repositorieName}/repos`
    );

    const data = await response.json();

    return data;
  }

  function handleAddRepository() {
    const newId = Math.random();

    setRepositories([
      ...repositories,
      { id: newId, name: `repo-test-${newId}` }
    ]);
  }

  function handleFavorite(id) {
    const newRepositories = repositories.map(repo => {
      return repo.id === id ? { ...repo, favorite: !repo.favorite } : repo;
    });

    setRepositories(newRepositories);
  }

  function handlePositionReceived({ coords }) {
    const { latitude, longitude } = coords;

    setLocation({ latitude, longitude });
  }

  return (
    <>
      <h1>Repositories</h1>
      <ul>
        {repositories.map(repo => (
          <li key={repo.id}>
            {repo.name}
            {repo.favorite && <span> (Favorite) </span>}
            <button onClick={() => handleFavorite(repo.id)}>Favorite</button>
          </li>
        ))}
        <br />
        <button onClick={handleAddRepository}>Add repositorie</button>
      </ul>
      <h1>Location</h1>
      Latitude: {location.latitude}
      <br />
      Longitude: {location.longitude}
    </>
  );
}
