import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cityCards, experiences, getawayTabs } from '../data/staticContent';

function HomePage() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const tabNames = Object.keys(getawayTabs);
  const [activeTab, setActiveTab] = useState(tabNames[0]);

  const goToLocation = (loc) =>
    navigate(loc ? `/location?location=${encodeURIComponent(loc)}` : '/location');

  return (
    <div className="home">
      {/* / Hero banner / */}
      <section className="hero">
        <div className="hero__overlay">
          <h1 className="hero__title">Not sure where to go? Perfect.</h1>
          <form
            className="hero__search"
            onSubmit={(e) => {
              e.preventDefault();
              goToLocation(heroSearch.trim());
            }}
          >
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Where are you going?"
              aria-label="Where are you going?"
            />
            <button type="submit" className="btn btn--primary">
              I'm flexible
            </button>
          </form>
        </div>
      </section>

      <div className="home__body">
        {/* / Inspiration for your next */}
        <section className="section">
          <h2 className="section__title">Inspiration for your next trip</h2>
          <div className="city-grid">
            {cityCards.map((c) => (
              <button className="city-card" key={c.name} onClick={() => goToLocation(c.location)}>
                <img src={c.image} alt={c.name} />
                <div className="city-card__text">
                  <span className="city-card__name">{c.name}</span>
                  <span className="city-card__sub">{c.subtitle}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* / Discover Airbnb Experiences / */}
        <section className="section">
          <h2 className="section__title">Discover Airbnb Experiences</h2>
          <div className="exp-grid">
            {experiences.map((e) => (
              <div
                className="exp-card"
                key={e.title}
                style={{ backgroundImage: `url(${e.image})` }}
              >
                <div className="exp-card__inner">
                  <h3>{e.title}</h3>
                  <button className="btn btn--light">{e.cta}</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* / Shop Airbnb gift cards */}
        <section className="section giftcards">
          <div className="giftcards__text">
            <h2 className="section__title">Shop Airbnb gift cards</h2>
            <p>Give the gift of travel and unforgettable stays.</p>
            <button className="btn btn--dark">Learn more</button>
          </div>
          <div className="giftcards__image">
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80"
              alt="Airbnb gift cards"
            />
          </div>
        </section>

        {/* / Questions about hosting / */}
        <section
          className="hosting"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80)',
          }}
        >
          <div className="hosting__inner">
            <h2>Questions about hosting?</h2>
            <button className="btn btn--light">Ask a Superhost</button>
          </div>
        </section>

        {/* / Inspiration for future getaways */}
        <section className="section">
          <h2 className="section__title">Inspiration for future getaways</h2>
          <div className="tabs" role="tablist">
            {tabNames.map((name) => (
              <button
                key={name}
                role="tab"
                aria-selected={activeTab === name}
                className={`tab ${activeTab === name ? 'tab--active' : ''}`}
                onClick={() => setActiveTab(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="getaway-list">
            {getawayTabs[activeTab].map((item) => (
              <button
                className="getaway-item"
                key={`${item.place}-${item.country}`}
                onClick={() => goToLocation(item.place)}
              >
                <span className="getaway-item__place">{item.place}</span>
                <span className="getaway-item__country">{item.country}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
