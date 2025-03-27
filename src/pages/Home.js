import React, { useState} from 'react';
import axios from 'axios';
import './Home.css';
import Navbar from './Navbar';

const moods = [
  'Happy',
  'Sad',
  'Relax',
  'Energetic',
  'Romantic',
  'Focus',
  'Party',
  'Workout',
];

const languages = ['English', 'Tamil', 'Hindi'];

const Home = ({ user }) => {

  const [mood, setMood] = useState(moods[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [loading, setLoading] = useState(false);

  const [allVideos, setAllVideos] = useState([]);
  const [visibleVideos, setVisibleVideos] = useState([]);
  const [shownVideoIds, setShownVideoIds] = useState(new Set());
  function fisherYatesShuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }  
  
  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://moodtunesbackend.onrender.com/songs/${mood}?lang=${language}`);
      const fetched = res.data.videos;
  
      setAllVideos(fetched);
      const initialShuffle = fisherYatesShuffle(fetched).slice(0, 8);
      setVisibleVideos(initialShuffle);
      setShownVideoIds(new Set(initialShuffle.map(v => v.videoId)));

      if (user) {
        await axios.post('https://moodtunesbackend.onrender.com/log', {
          userId: user.userId,
          mood: mood, // replace with actual selected mood variable
        });
      }

    } catch (err) {
      console.error("Error fetching songs", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleShuffle = () => {
    const unseenVideos = allVideos.filter(video => !shownVideoIds.has(video.videoId));
  
    if (unseenVideos.length < 8) {
      // All videos shown, start over
      const reshuffled = fisherYatesShuffle(allVideos).slice(0, 8);
      setVisibleVideos(reshuffled);
      setShownVideoIds(new Set(reshuffled.map(v => v.videoId)));
    } else {
      const shuffled = fisherYatesShuffle(unseenVideos).slice(0, 8);
      setVisibleVideos(shuffled);
      setShownVideoIds(prev => {
        const updated = new Set([...prev, ...shuffled.map(v => v.videoId)]);
        return updated;
      });
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSongs();
  };

  return (
    <div className="home">
      <Navbar user={user} />
      <h1 className="title">🎵 MoodTunes</h1>

      <form className="form" onSubmit={handleSubmit}>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="select mood-select"
        >
          {moods.map((m, idx) => (
            <option key={idx} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="select"
        >
          {languages.map((lang, idx) => (
            <option key={idx} value={lang}>{lang}</option>
          ))}
        </select>

        {/* <button type="submit" className="button">Play Mood 🎧</button> */}
        <div className="form-buttons">
            <button type="submit" className="button">Play Mood 🎧</button>
            <button onClick={handleShuffle} className="button shuffle-btn">🎲 Shuffle Songs</button>
        </div>

      </form>

      {loading ? (
        <p className="loading">Loading songs...</p>
      ) : (
        <div className="video-grid">
          {visibleVideos.map((video, index) => (
            <div key={index} className="video-card">
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={video.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <p className="video-title">{video.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
