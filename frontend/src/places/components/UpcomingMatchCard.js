import React from 'react';

const UpcomingMatchCard = ({ match, onSubmit }) => (
    <div className="match-card">
        <div className="match-card-mini-top">
            <div className="match-info-mini">
                <span>{match.startTime.slice(0, 10)}</span>
                <span>{match.startTime.slice(11, 16)}</span>
            </div>
            <div className="match-action-mini">
                <button onClick={() => onSubmit(match)}>Create event</button>
            </div>
        </div>
        <div className="teams">
            <div className="home">
                <img className="flag" src={match.homeTeamLogo} alt="home" />
                <span className="team">{match.homeTeamName}</span>
            </div>
            <div className="teams-seprator"><span>VS</span></div>
            <div className="away">
                <span className="team">{match.awayTeamName}</span>
                <img className="flag" src={match.awayTeamLogo} alt="away" style={{ marginLeft: "1rem" }} />
            </div>
        </div>
        <div className="match-info">
            <span className="match-info-date">{match.startTime.slice(0, 10)}</span>
            <span className="match-info-day">
                {new Date(match.startTime.slice(0, 10)).toLocaleDateString("en-US", { weekday: "long" })}
            </span>
            <span className="match-info-time">{match.startTime.slice(11, 16)}</span>
        </div>
        <div className="match-action">
            <button onClick={() => onSubmit(match)}>Create event</button>
        </div>
    </div>
);

export default UpcomingMatchCard;
