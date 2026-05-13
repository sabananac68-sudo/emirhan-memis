import { useState, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Results from './components/Results';
import Extensions from './components/Extensions';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const resultsRef = useRef(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleNewSearch = () => {
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Header />
      <Hero onSearch={handleSearch} />
      <div ref={resultsRef}>
        <Results searchQuery={searchQuery} onNewSearch={handleNewSearch} />
      </div>
      <Extensions onSearch={handleSearch} />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
